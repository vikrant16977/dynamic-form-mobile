import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            />
          )}

          {forms.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ marginBottom: 8 }}>Select Form to Edit</Text>
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
          )}
        </View>

        {selectedFormId && selectedForm && (
          <AdminFormBuilder
            selectedForm={selectedForm}
            forms={forms}
            setForms={setForms}
            selectedFormId={selectedFormId}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingVertical: 40, paddingHorizontal: 16 },
  segment: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButtons: { flexDirection: "row", gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginVertical: 12,
  },
  picker: { marginBottom: 16 },
});

export default AdminPage;
