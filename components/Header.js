import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        <Text style={styles.f}>F</Text>
        <Text style={styles.a}>A</Text>
        <Text style={styles.c}>C</Text>
        <Text style={styles.t}>T</Text>
        <Text style={styles.subtitle}> Field Audit Collection Tool</Text>
      </Text>
      {/* Optional: Add navigation links or user menu here */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0C2D87",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flexDirection: "row",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#fff",
  },
  f: { color: "#ef4444" }, // Tailwind red-500
  a: { color: "#facc15" }, // Tailwind yellow-400
  c: { color: "#4ade80" }, // Tailwind green-400
  t: { color: "#7dd3fc" }, // Tailwind blue-300
  subtitle: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "normal",
  },
});
