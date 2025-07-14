import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FormContext } from "../context/FormContext";
import { ActivityIndicator } from "react-native";
import HeaderBar from "../components/HeaderBar";

const UserPage = () => {
  const { forms, selectedFormId, updateSelectedFormId, getSelectedForm ,loading} =
    useContext(FormContext);

  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedForm = getSelectedForm();

  const handleChange = (sectionId, questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [questionId]: value },
    }));
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log("Form submitted:", responses);
    setSubmitted(true);
  };

  const handleClear = () => {
    setResponses({});
  };

   if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <HeaderBar />
        <ActivityIndicator size="large" color="#11329E" />
        <Text>Loading forms...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Select the Form to Submit</Text>

        {/* Form Selection */}
        {forms.length > 0 ? (
          <Picker
            selectedValue={selectedFormId}
            onValueChange={(value) => {
              updateSelectedFormId(value);
              setResponses({});
              setSubmitted(false);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select a form" value={null} />
            {forms.map((f) => (
              <Picker.Item key={f.id} label={f.title} value={f.id} />
            ))}
          </Picker>
        ) : (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              No forms available. Please ask admin to create one.
            </Text>
          </View>
        )}

        {/* Render Selected Form */}
        {selectedForm && (
          <View>
            {selectedForm.sections.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
                <View>
                  {section.questions.map((q) => {
                    const sectionResp = responses[section.id] || {};
                    const val = sectionResp[q.id] ?? "";

                    return (
                      <View key={q.id} style={styles.questionContainer}>
                        <Text style={styles.label}>{q.label}</Text>
                        {/* Text Input */}
                        {q.type === "text" && (
                          <TextInput
                            style={styles.input}
                            value={val}
                            onChangeText={(t) =>
                              handleChange(section.id, q.id, t)
                            }
                          />
                        )}
                        {/* Textarea */}
                        {q.type === "textarea" && (
                          <TextInput
                            style={[styles.input, { height: 80 }]}
                            multiline={true}
                            value={val}
                            onChangeText={(t) =>
                              handleChange(section.id, q.id, t)
                            }
                          />
                        )}
                        {/* Radio */}
                        {q.type === "radio" && (
                          <View style={styles.optionsRow}>
                            {q.options.map((opt, i) => (
                              <View key={i} style={styles.radioOption}>
                                <Text
                                  style={[
                                    styles.radioLabel,
                                    val === opt && styles.selectedRadio,
                                  ]}
                                  onPress={() =>
                                    handleChange(section.id, q.id, opt)
                                  }
                                >
                                  {val === opt ? "●" : "○"} {opt}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                        {/* Checkbox */}
                        {q.type === "checkbox" && (
                          <View style={styles.optionsRow}>
                            {q.options.map((opt, i) => {
                              const arr = Array.isArray(val) ? val : [];
                              return (
                                <View key={i} style={styles.checkboxOption}>
                                  <Text
                                    style={[
                                      styles.checkboxLabel,
                                      arr.includes(opt) &&
                                        styles.selectedCheckbox,
                                    ]}
                                    onPress={() =>
                                      handleChange(
                                        section.id,
                                        q.id,
                                        arr.includes(opt)
                                          ? arr.filter((x) => x !== opt)
                                          : [...arr, opt]
                                      )
                                    }
                                  >
                                    {arr.includes(opt) ? "[x]" : "[ ]"} {opt}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                        {/* Dropdown */}
                        {q.type === "dropdown" && (
                          <Picker
                            selectedValue={val}
                            onValueChange={(value) =>
                              handleChange(section.id, q.id, value)
                            }
                            style={styles.input}
                          >
                            <Picker.Item label="Select..." value={null} />
                            {q.options.map((opt, idx) => (
                              <Picker.Item key={idx} label={opt} value={opt} />
                            ))}
                          </Picker>
                        )}
                        {/* Number Input */}
                        {q.type === "number" && (
                          <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={val}
                            onChangeText={(t) =>
                              handleChange(section.id, q.id, t)
                            }
                          />
                        )}
                        {/* Email Input */}
                        {q.type === "email" && (
                          <TextInput
                            style={styles.input}
                            keyboardType="email-address"
                            value={val}
                            onChangeText={(t) =>
                              handleChange(section.id, q.id, t)
                            }
                          />
                        )}
                        {/* Date Input */}
                        {q.type === "date" && (
                          <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={val}
                            onChangeText={(t) =>
                              handleChange(section.id, q.id, t)
                            }
                          />
                        )}
                        {/* Time Input */}
                        {q.type === "time" && (
                          <TextInput
                            style={styles.input}
                            placeholder="HH:MM"
                            value={val}
                            onChangeText={(t) =>
                              handleChange(section.id, q.id, t)
                            }
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
            <View style={styles.buttonRow}>
              <Button title="Clear" onPress={handleClear} />
              <Button title="Submit" color="#11329E" onPress={handleSubmit} />
            </View>
          </View>
        )}

        {/* Success Message */}
        {submitted && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Form submitted! Your responses have been recorded.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingVertical: 40, paddingHorizontal: 16 },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textDecorationLine: "underline",
  },
  picker: { marginBottom: 24 },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  warningText: { color: "#856404" },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#11329E",
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionContainer: { marginBottom: 14 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  radioOption: { marginRight: 16 },
  radioLabel: { fontSize: 16, color: "#333" },
  selectedRadio: { color: "#11329E" },
  checkboxOption: { marginRight: 16 },
  checkboxLabel: { fontSize: 16, color: "#333" },
  selectedCheckbox: { color: "#11329E" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  successBox: {
    backgroundColor: "#d4edda",
    padding: 10,
    borderRadius: 6,
    marginTop: 16,
  },
  successText: { color: "#155724" },
});

export default UserPage;
