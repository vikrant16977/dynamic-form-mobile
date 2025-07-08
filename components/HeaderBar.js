import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
// Replace this with the actual require or import for your logo asset in React Native
const logo = require("./images/socal-gas.png");

const HeaderBar = ({ routeName }) => {
  // routeName should be current screen route to highlight selected nav
  // navigation should be from React Navigation
  const navigation = useNavigation();
  return (
    <>
      {/* Logo Row */}
      <View style={styles.logoRow}>
        <TouchableOpacity onPress={() => navigation?.navigate("Home")}>
        </TouchableOpacity>
      </View>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate("Home")}
        >
          <Text
            style={[
              styles.navText,
              routeName === "Home" && styles.navTextActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate("Admin")}
        >
          <Text
            style={[
              styles.navText,
              routeName === "Admin" && styles.navTextActive,
            ]}
          >
            Form Creator
          </Text>
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconNav}
            onPress={() => navigation?.navigate("Form")}
          >
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.iconLabel}>User</Text>
          </TouchableOpacity>
          <View style={styles.iconNav}>
            <Text style={styles.icon}>❓</Text>
            <Text style={styles.iconLabel}>Help</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logoRow: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 36,
  },
  navbar: {
    backgroundColor: "#0C2D87",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 4,
    justifyContent: "space-between",
  },
  navItem: {
    marginRight: 24,
  },
  navText: {
    color: "#fff",
    fontWeight: "normal",
    fontSize: 16,
  },
  navTextActive: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 12,
  },
  iconNav: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    color: "#fff",
    marginRight: 4,
    fontSize: 18,
  },
  iconLabel: {
    color: "#fff",
    fontSize: 16,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#002366",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HeaderBar;
