import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FormContext } from "../context/FormContext";
import HeaderBar from "../components/HeaderBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// Optional: NetInfo configuration for corporate networks
NetInfo.configure({
  reachabilityUrl: "https://www.apple.com/library/test/success.html",
  reachabilityTest: (response) => response.status === 200,
});

const FORM_RESPONSES_CACHE_KEY = "cached_form_responses";
const FORM_SELECTION_CACHE_KEY = "cached_form_selection";

const UserPage = () => {
  const {
    forms,
    selectedFormId,
    updateSelectedFormId,
    getSelectedForm,
    loading,
  } = useContext(FormContext);

  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState({}); // { [sectionId]: { [questionId]: { [option]: comment } } }
  const [modalVisible, setModalVisible] = useState(false);
  const [modalField, setModalField] = useState({
    sectionId: null,
    questionId: null,
    option: null,
    value: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const selectedForm = getSelectedForm();

  // Network status listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Load cached responses if offline
  useEffect(() => {
    const loadCached = async () => {
      if (isOffline) {
        try {
          const cached = await AsyncStorage.getItem(FORM_RESPONSES_CACHE_KEY);
          if (cached) setResponses(JSON.parse(cached));
          const cachedSel = await AsyncStorage.getItem(FORM_SELECTION_CACHE_KEY);
          if (cachedSel) updateSelectedFormId(JSON.parse(cachedSel));
        } catch {}
      }
    };
    loadCached();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline]);

  // Save comments to AsyncStorage for persistence
  useEffect(() => {
    AsyncStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  // Load comments if offline
  useEffect(() => {
    const loadCachedComments = async () => {
      const cached = await AsyncStorage.getItem("comments");
      if (cached) setComments(JSON.parse(cached));
    };
    loadCachedComments();
  }, []);

  const handleChange = (sectionId, questionId, value) => {
    setResponses((prev) => {
      const updated = {
        ...prev,
        [sectionId]: { ...prev[sectionId], [questionId]: value },
      };
      AsyncStorage.setItem(FORM_RESPONSES_CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleOptionPress = (sectionId, questionId, option, currentValue, type) => {
    // currentValue: For radio, this is the selected value; for checkbox, it's an array
    setModalField({
      sectionId,
      questionId,
      option,
      value:
        comments?.[sectionId]?.[questionId]?.[option] ??
        "",
      type,
      currentValue,
    });
    setModalVisible(true);
  };

  const handleModalSave = () => {
    const { sectionId, questionId, option, value, type, currentValue } = modalField;

    // Update comments state
    setComments((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [questionId]: {
          ...(prev[sectionId]?.[questionId] || {}),
          [option]: value,
        },
      },
    }));

    // Update responses state
    if (type === "radio") {
      handleChange(sectionId, questionId, option);
    } else if (type === "checkbox") {
      // Toggle the option as per original logic
      let arr = Array.isArray(currentValue) ? currentValue : [];
      let updatedArr;
      if (arr.includes(option)) {
        updatedArr = arr.filter((x) => x !== option);
      } else {
        updatedArr = [...arr, option];
      }
      handleChange(sectionId, questionId, updatedArr);
    }

    setModalVisible(false);
    setModalField({ sectionId: null, questionId: null, option: null, value: "" });
  };

  const handleSubmit = async () => {
    // Submit logic here
    if (isOffline) {
      Alert.alert(
        "Offline",
        "You're offline. Your responses are saved locally and will need to be submitted when online."
      );
      setSubmitted(true);
    } else {
      // Replace with actual API submit logic if needed
      console.log("Form submitted:", responses, comments);
      setSubmitted(true);
      await AsyncStorage.removeItem(FORM_RESPONSES_CACHE_KEY);
      await AsyncStorage.removeItem("comments");
    }
  };

  const handleClear = async () => {
    setResponses({});
    setComments({});
    await AsyncStorage.removeItem(FORM_RESPONSES_CACHE_KEY);
    await AsyncStorage.removeItem("comments");
  };

  const handleFormChange = (value) => {
    updateSelectedFormId(value);
    setResponses({});
    setComments({});
    setSubmitted(false);
    AsyncStorage.setItem(FORM_SELECTION_CACHE_KEY, JSON.stringify(value));
    AsyncStorage.removeItem(FORM_RESPONSES_CACHE_KEY);
    AsyncStorage.removeItem("comments");
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

        {/* Offline Banner */}
        {isOffline && (
          <View style={styles.offlineBox}>
            <Text style={styles.offlineText}>
              You are offline. Filling forms will be saved locally and must be submitted later.
            </Text>
          </View>
        )}

        {/* Form Selection */}
        {forms.length > 0 ? (
          <Picker
            selectedValue={selectedFormId}
            onValueChange={handleFormChange}
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
                    const commentMap = comments?.[section.id]?.[q.id] || {};

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
                                <TouchableOpacity
                                  onPress={() =>
                                    handleOptionPress(
                                      section.id,
                                      q.id,
                                      opt,
                                      val,
                                      "radio"
                                    )
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.radioLabel,
                                      val === opt && styles.selectedRadio,
                                    ]}
                                  >
                                    {val === opt ? "●" : "○"} {opt}
                                  </Text>
                                </TouchableOpacity>
                                {/* Show comment if exists for this radio option */}
                                {commentMap[opt] ? (
                                  <Text style={styles.commentText}>
                                    Comment: {commentMap[opt]}
                                  </Text>
                                ) : null}
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
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleOptionPress(
                                        section.id,
                                        q.id,
                                        opt,
                                        arr,
                                        "checkbox"
                                      )
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.checkboxLabel,
                                        arr.includes(opt) && styles.selectedCheckbox,
                                      ]}
                                    >
                                      {arr.includes(opt) ? "[x]" : "[ ]"} {opt}
                                    </Text>
                                  </TouchableOpacity>
                                  {/* Show comment if exists for this checkbox option */}
                                  {commentMap[opt] ? (
                                    <Text style={styles.commentText}>
                                      Comment: {commentMap[opt]}
                                    </Text>
                                  ) : null}
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
              Form submitted! Your responses have been {isOffline ? "saved locally." : "recorded."}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal for comment input */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add a comment</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a comment for selecting:{" "}
              <Text style={{ fontWeight: "bold" }}>{modalField.option}</Text>
            </Text>
            <TextInput
              style={styles.modalInput}
              value={modalField.value}
              placeholder="Enter comment"
              onChangeText={(t) =>
                setModalField((prev) => ({ ...prev, value: t }))
              }
              multiline={true}
              numberOfLines={3}
            />
            <View style={styles.modalButtonsRow}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button
                title="Save"
                color="#11329E"
                onPress={handleModalSave}
                disabled={!modalField.value}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  offlineBox: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  offlineText: { color: "#842029" },
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
  radioOption: { marginRight: 16, marginBottom: 8 },
  radioLabel: { fontSize: 16, color: "#333" },
  selectedRadio: { color: "#11329E" },
  checkboxOption: { marginRight: 16, marginBottom: 8 },
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
  commentText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    marginLeft: 6,
    marginTop: 2,
    marginBottom: 2,
    flexShrink: 1,
    maxWidth: 220,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.36)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalSubtitle: { fontSize: 15, marginBottom: 15 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    minHeight: 60,
    backgroundColor: "#fafafa",
    marginBottom: 16,
    textAlignVertical: "top",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
});

export default UserPage;