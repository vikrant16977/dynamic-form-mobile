import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { FormContext } from "../context/FormContext";
import FormPreview from "./FormPreview";
import FieldPropertyModal from "./FieldPropertyModal";

const questionTypeOptions = [
  { key: "text", text: "Text Field", value: "text" },
  { key: "textarea", text: "Textarea", value: "textarea" },
  { key: "radio", text: "Radio Buttons", value: "radio" },
  { key: "checkbox", text: "Checkbox", value: "checkbox" },
  { key: "dropdown", text: "Dropdown", value: "dropdown" },
  { key: "number", text: "Number Field", value: "number" },
  { key: "email", text: "Email Field", value: "email" },
  { key: "date", text: "Date Picker", value: "date" },
];

const AdminFormBuilder = ({
  selectedForm,
  forms,
  setForms,
  selectedFormId,
}) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const { addSectionToForm } = useContext(FormContext);

  const handleQuestionClick = (sectionId, questionId) => {
    const section = selectedForm.sections.find((s) => s.id === sectionId);
    const question = section.questions.find((q) => q.id === questionId);
    setSelectedField(question);
    setSelectedSectionId(sectionId);
    setModalOpen(true);
  };

  const handleModalSave = (updatedField) => {
    const updatedForms = forms.map((form) => {
      if (form.id === selectedFormId) {
        const updatedSections = form.sections.map((section) => {
          if (section.id === selectedSectionId) {
            const updatedQuestions = section.questions.map((q) =>
              q.id === updatedField.id ? updatedField : q
            );
            return { ...section, questions: updatedQuestions };
          }
          return section;
        });
        return { ...form, sections: updatedSections };
      }
      return form;
    });

    setForms(updatedForms);
    // Use AsyncStorage in actual app for persistence
    setModalOpen(false);
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim() !== "") {
      const newSection = {
        id: Date.now(),
        sectionTitle: newSectionTitle.trim(),
        questions: [],
      };
      addSectionToForm(selectedFormId, newSection);
      setNewSectionTitle("");
    }
  };

  const handleAddFieldToSection = (type) => {
    if (!activeSectionId) {
      Alert.alert("Please select a section to add the field.");
      return;
    }

    const updatedForms = forms.map((form) => {
      if (form.id === selectedFormId) {
        const updatedSections = form.sections.map((section) => {
          if (section.id === activeSectionId) {
            const newQuestion = {
              id: Date.now(),
              label: `${type} field`,
              type,
              options:
                type === "radio" || type === "dropdown"
                  ? ["Option 1", "Option 2"]
                  : [],
            };
            return {
              ...section,
              questions: [...section.questions, newQuestion],
            };
          }
          return section;
        });
        return { ...form, sections: updatedSections };
      }
      return form;
    });

    setForms(updatedForms);
    // Use AsyncStorage in actual app for persistence
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.segment}>
            <Text style={styles.sidebarHeader}>Add Section</Text>
            <TextInput
              placeholder="Section Title"
              value={newSectionTitle}
              onChangeText={setNewSectionTitle}
              style={styles.input}
            />
            <Button
              title="Add Section"
              color="#11329E"
              onPress={handleAddSection}
            />
          </View>
          <View style={styles.segment}>
            <Text style={styles.sidebarHeader}>Add Components</Text>
            {questionTypeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={styles.componentBtn}
                onPress={() => handleAddFieldToSection(opt.value)}
              >
                <Text style={styles.componentText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Main Area */}
        <View style={styles.main}>
          <Text style={styles.previewHeader}>Live Preview</Text>
          {selectedForm?.sections?.length > 0 ? (
            <Text style={styles.previewSubtext}>
              Tap on the below field types to open its editing options*
            </Text>
          ) : (
            <Text style={styles.previewSubtext}>
              Add sections from left menu by entering section's title and
              clicking on "Add Section" button to start creating your form.
            </Text>
          )}
          <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <FormPreview
              form={selectedForm}
              setActiveSectionId={setActiveSectionId}
              activeSectionId={activeSectionId}
              onQuestionClick={handleQuestionClick}
            />
          </ScrollView>
        </View>
      </View>
      <FieldPropertyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        field={selectedField}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  row: { flexDirection: "row", flex: 1 },
  sidebar: { width: 200, padding: 8, backgroundColor: "#f9f9f9" },
  segment: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  sidebarHeader: { fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 8,
    padding: 8,
  },
  componentBtn: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 6,
    alignItems: "center",
  },
  componentText: { color: "#11329E", fontWeight: "bold" },
  main: { flex: 1, padding: 8 },
  previewHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  previewSubtext: { color: "#888", marginBottom: 8 },
});

export default AdminFormBuilder;