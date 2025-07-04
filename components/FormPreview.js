import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const FormPreview = ({
  form,
  setActiveSectionId,
  activeSectionId,
  onQuestionClick,
}) => {
  if (!form) return null;

  return (
    <ScrollView>
      {form.sections.map((section) => (
        <TouchableOpacity
          key={section.id}
          onPress={() => setActiveSectionId(section.id)}
          activeOpacity={0.85}
          style={[
            styles.section,
            activeSectionId === section.id && styles.activeSection,
          ]}
        >
          <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
          <View style={styles.grid}>
            {section.questions.map((q) => (
              <TouchableOpacity
                style={styles.gridColumn}
                key={q.id}
                activeOpacity={0.8}
                onPress={(e) => {
                  // Prevent bubbling to section
                  if (onQuestionClick) onQuestionClick(section.id, q.id);
                }}
              >
                <View style={styles.field}>
                  <Text style={styles.label}>{q.label}</Text>
                  {q.type === "text" && (
                    <TextInput
                      style={styles.input}
                      placeholder={q.placeholder || ""}
                      editable={false}
                    />
                  )}
                  {q.type === "textarea" && (
                    <TextInput
                      style={[styles.input, { height: 60 }]}
                      multiline
                      placeholder={q.placeholder || ""}
                      editable={false}
                    />
                  )}
                  {q.type === "radio" && (
                    <View style={styles.optionsRow}>
                      {q.options.map((opt, i) => (
                        <View key={i} style={styles.radioOption}>
                          <Text style={styles.optionText}>○ {opt}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {q.type === "checkbox" && (
                    <View style={styles.optionsRow}>
                      {q.options.map((opt, i) => (
                        <View key={i} style={styles.checkboxOption}>
                          <Text style={styles.optionText}>[ ] {opt}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {q.type === "dropdown" && (
                    <View style={[styles.input, styles.dropdown]}>
                      <Text style={styles.optionText}>▼ Select...</Text>
                    </View>
                  )}
                  {q.type === "number" && (
                    <TextInput
                      style={styles.input}
                      placeholder={q.placeholder || ""}
                      keyboardType="numeric"
                      editable={false}
                    />
                  )}
                  {q.type === "email" && (
                    <TextInput
                      style={styles.input}
                      placeholder={q.placeholder || ""}
                      keyboardType="email-address"
                      editable={false}
                    />
                  )}
                  {q.type === "date" && (
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      editable={false}
                    />
                  )}
                  {q.type === "time" && (
                    <TextInput
                      style={styles.input}
                      placeholder="HH:MM"
                      editable={false}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  activeSection: {
    backgroundColor: "#e0f7fa",
    borderColor: "#d6d6d6",
    borderWidth: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#11329E",
    fontWeight: "bold",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridColumn: {
    width: "48%",
    marginRight: "2%",
    marginBottom: 10,
  },
  field: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    borderColor: "#eee",
    borderWidth: 1,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 6,
    backgroundColor: "#f3f3f3",
    color: "#888",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  radioOption: {
    marginRight: 12,
  },
  checkboxOption: {
    marginRight: 12,
  },
  optionText: {
    color: "#555",
    fontSize: 15,
  },
  dropdown: {
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: 32,
  },
});

export default FormPreview;
