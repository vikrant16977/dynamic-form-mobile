import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Picker,
  Platform,
} from "react-native";
import { FormContext } from "../context/FormContext";

const fieldTypeOptions = [
  { key: "text", label: "Text Input", value: "text" },
  { key: "textarea", label: "Textarea", value: "textarea" },
  { key: "radio", label: "Radio Group", value: "radio" },
  { key: "checkbox", label: "Checkbox Group", value: "checkbox" },
  { key: "select", label: "Dropdown Select", value: "select" },
];

const FormBuilder = () => {
  const { addFieldToForm, activeFormId } = useContext(FormContext);
  const [label, setLabel] = useState("");
  const [type, setType] = useState("");
  const [optionsText, setOptionsText] = useState("");

  const handleAddField = () => {
    if (!label || !type) return;

    const field = {
      label,
      type,
      options: ["radio", "checkbox", "select"].includes(type)
        ? optionsText.split(",").map((opt) => opt.trim())
        : [],
    };

    addFieldToForm(activeFormId, field);

    setLabel("");
    setType("");
    setOptionsText("");
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Field Label</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Full Name"
          value={label}
          onChangeText={setLabel}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Field Type</Text>
        {/* Use native Picker or a UI library for dropdowns */}
        {Platform.OS === "android" || Platform.OS === "ios" ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={type}
              onValueChange={setType}
              style={styles.picker}
            >
              <Picker.Item label="Select Type" value="" />
              {fieldTypeOptions.map((opt) => (
                <Picker.Item
                  key={opt.key}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Type (e.g. text, radio)"
            value={type}
            onChangeText={setType}
          />
        )}
      </View>

      {["radio", "checkbox", "select"].includes(type) && (
        <View style={styles.field}>
          <Text style={styles.label}>Options (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="Option1, Option2, Option3"
            value={optionsText}
            onChangeText={setOptionsText}
          />
        </View>
      )}

      <Button title="Add Field" color="#11329E" onPress={handleAddField} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: { padding: 12, backgroundColor: "#fff" },
  field: { marginBottom: 16 },
  label: { fontWeight: "bold", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  picker: { height: 40, width: "100%" },
});

export default FormBuilder;
