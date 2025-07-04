import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";

// Replace with your own Modal implementation if not using a UI library like React Native Paper or React Native Modal
const FieldPropertyModal = ({ open, onClose, onSave, field }) => {
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [options, setOptions] = useState("");
  const [mandatory, setMandatory] = useState(true);

  useEffect(() => {
    if (field) {
      setLabel(field.label || "");
      setPlaceholder(field.placeholder || "");
      setOptions((field.options || []).join("\n"));
      setMandatory(field.required ?? true);
    }
  }, [field]);

  if (!field) return null;

  const handleSave = () => {
    const updatedField = {
      ...field,
      label,
      placeholder,
      required: mandatory,
      options:
        field.type === "radio" ||
        field.type === "checkbox" ||
        field.type === "dropdown"
          ? options.split("\n").filter((opt) => opt.trim() !== "")
          : [],
    };
    onSave(updatedField);
  };

  // Simple Modal presentation, you can swap for a library/modal if desired
  if (!open) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.header}>Edit Field Properties</Text>
        <ScrollView>
          <Text style={styles.label}>Label</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
          />
          <Text style={styles.label}>Placeholder</Text>
          <TextInput
            style={styles.input}
            value={placeholder}
            onChangeText={setPlaceholder}
          />
          {(field.type === "radio" ||
            field.type === "checkbox" ||
            field.type === "dropdown") && (
            <>
              <Text style={styles.label}>Options (one per line)</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={options}
                onChangeText={setOptions}
                multiline
              />
            </>
          )}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Mandatory?</Text>
            <Switch
              value={mandatory}
              onValueChange={setMandatory}
              style={{ marginLeft: 8 }}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  label: { fontWeight: "600", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  switchRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  switchLabel: { fontWeight: "bold", color: "#333" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#11329E",
  },
  cancelBtnText: { color: "#333" },
  saveBtnText: { color: "#fff" },
});

export default FieldPropertyModal;
