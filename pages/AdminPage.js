import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FormContext } from "../context/FormContext";
import HeaderBar from "../components/HeaderBar";
import AdminFormBuilder from "../components/AdminFormBuilder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const AdminPage = () => {
  const navigation = useNavigation();
  const { forms, setForms, selectedFormId, addNewForm, updateSelectedFormId } =
    useContext(FormContext);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newForm, setNewForm] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("newForm").then(setNewForm);
  }, []);

  const selectedForm = forms.find((f) => f.id === selectedFormId);

  const handleCreateForm = () => {
    if (!newFormTitle.trim()) return;
    addNewForm(newFormTitle.trim());
    setNewFormTitle("");
  };

  return (
    <View style={styles.container}>
      <HeaderBar />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.segment}>
            {newForm === "true" ? (
              <View style={styles.headerRow}>
                <Text style={styles.header}>Form Builder</Text>
                <View style={styles.headerButtons}>
                  <Button
                    title="Back"
                    color="grey"
                    onPress={() => navigation.navigate("Home")}
                  />
                  <Button
                    title="Create"
                    color="#11329E"
                    onPress={handleCreateForm}
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.header}>Form Editor</Text>
              </View>
            )}

            {newForm === "true" && (
              <TextInput
                placeholder="Form Title"
                value={newFormTitle}
                onChangeText={setNewFormTitle}
                style={styles.input}
                returnKeyType="done"
              />
            )}

            {forms.length > 0 && (
              <View style={styles.formPickerContainer}>
                <Text style={styles.formPickerLabel}>Select Form to Edit</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedFormId}
                    onValueChange={updateSelectedFormId}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a form" value={null} />
                    {forms.map((f) => (
                      <Picker.Item key={f.id} label={f.title} value={f.id} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View>

          {selectedFormId && selectedForm && (
            <View style={styles.builderWrapper}>
              <AdminFormBuilder
                selectedForm={selectedForm}
                forms={forms}
                setForms={setForms}
                selectedFormId={selectedFormId}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  scrollContent: {
    paddingVertical: 36,
    paddingHorizontal: 8,
    flexGrow: 1,
    alignItems: "center",
  },
  segment: {
    width: "100%",
    maxWidth: 650,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 12, color: "#11329E" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headerButtons: { flexDirection: "row", gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#c6c6c6",
    borderRadius: 6,
    padding: 12,
    marginVertical: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  formPickerContainer: {
    marginTop: 18,
    marginBottom: 6,
    width: "100%",
  },
  formPickerLabel: {
    marginBottom: 7,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  picker: {
    marginBottom: 10,
    width: "100%",
    minWidth: 200,
  },
  builderWrapper: {
    width: "100%",
    maxWidth: 1100,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 8,
    elevation: 1,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
});

export default AdminPage;