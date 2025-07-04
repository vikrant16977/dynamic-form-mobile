import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FormContext } from "../context/FormContext";
import HeaderBar from "../components/HeaderBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const HomePage = () => {
  const { forms, updateSelectedFormId, addNewForm } = useContext(FormContext);
  const [formName, setFormName] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const navigation = useNavigation();

  const handleCreate = async () => {
    if (!formName.trim()) return;
    await AsyncStorage.setItem("newForm", "true");
    addNewForm(formName.trim());
    navigation.navigate("Admin");
  };

  const handleEdit = async () => {
    if (!selectedForm) return;
    updateSelectedFormId(selectedForm);
    await AsyncStorage.setItem("newForm", "false");
    navigation.navigate("Admin");
  };

  const handleDiscard = () => {
    setFormName("");
    setSelectedForm(null);
  };

  return (
    <View style={styles.container}>
      <HeaderBar />
      <View style={styles.segment}>
        <Text style={styles.header}>Create a New Form</Text>
        <TextInput
          placeholder="Enter Form Name"
          value={formName}
          onChangeText={setFormName}
          style={styles.input}
        />
        <Text style={styles.orText}>Or</Text>
        <Picker
          selectedValue={selectedForm}
          onValueChange={(itemValue, itemIndex) => setSelectedForm(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select pre-existing Forms" value={null} />
          {forms.map((f) => (
            <Picker.Item key={f.id} label={f.title} value={f.id} />
          ))}
        </Picker>
        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <Button title="Discard" onPress={handleDiscard} />
          </View>
          <View style={styles.buttonContainer}>
            {selectedForm ? (
              <Button
                title="Edit"
                color="#11329E"
                onPress={handleEdit}
                disabled={!formName && !selectedForm}
              />
            ) : (
              <Button
                title="Create"
                color="#11329E"
                onPress={handleCreate}
                disabled={!formName && !selectedForm}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: "#fff" },
  segment: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  orText: { textAlign: "center", marginVertical: 10, color: "#888" },
  picker: { marginBottom: 20 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  buttonContainer: { flex: 1, marginHorizontal: 5 },
});

export default HomePage;
