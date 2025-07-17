import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FormContext } from "../context/FormContext";
import HeaderBar from "../components/HeaderBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const HomePage = () => {
  const { forms, updateSelectedFormId } = useContext(FormContext);
  const [selectedForm, setSelectedForm] = useState(null);
  const navigation = useNavigation();

  // The user is not editing the form structure, just filling the form.
  const handleFillForm = async () => {
    if (!selectedForm) {
      Alert.alert("Form Selection Required", "Please select a form to fill.");
      return;
    }
    updateSelectedFormId(selectedForm);
    await AsyncStorage.setItem("newForm", "false");
    navigation.navigate("Form");
  };

  const handleDiscard = () => {
    setSelectedForm(null);
  };

  return (
    <View style={styles.bg}>
      <HeaderBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Welcome to Dynamic Forms</Text>
            <Text style={styles.subtitle}>
              Fill in and submit your forms with ease!
            </Text>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Fill an Existing Form</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedForm}
                  onValueChange={(itemValue) => setSelectedForm(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#11329E"
                >
                  <Picker.Item
                    label="Select pre-existing Form"
                    value={null}
                    color="#888"
                  />
                  {forms.length === 0 ? (
                    <Picker.Item label="No forms available" value={null} />
                  ) : (
                    forms.map((f) => (
                      <Picker.Item key={f.id} label={f.title} value={f.id} />
                    ))
                  )}
                </Picker>
              </View>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  !selectedForm && styles.buttonDisabled,
                ]}
                onPress={handleFillForm}
                disabled={!selectedForm}
              >
                <Text style={styles.primaryButtonText}>Fill Form</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={handleDiscard}>
              <Text style={styles.clearButtonText}>Clear Selection</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#11329E",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1.1,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 28,
    textAlign: "center",
    fontWeight: "500",
  },
  card: {
    width: "99%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#11329E",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 14,
    elevation: 5,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#11329E",
    marginBottom: 14,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d6d8e7",
    borderRadius: 7,
    backgroundColor: "#f7f9fc",
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    color: "#222",
    backgroundColor: "#f7f9fc",
  },
  primaryButton: {
    backgroundColor: "#11329E",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 7,
    alignItems: "center",
    width: "100%",
    marginTop: 4,
    marginBottom: 2,
    shadowColor: "#11329E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.6,
  },
  buttonDisabled: {
    backgroundColor: "#c7cfea",
  },
  clearButton: {
    marginTop: 6,
    padding: 8,
    borderRadius: 7,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#fff0f0",
    borderWidth: 1,
    borderColor: "#ebced0",
  },
  clearButtonText: {
    color: "#d65a6f",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.8,
  },
});

export default HomePage;