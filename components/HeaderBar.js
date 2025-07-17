import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
const logo = require("./images/socal-gas.png");

const HeaderBar = ({ routeName }) => {
  const navigation = useNavigation();
  return (
    <>
      {/* Logo Row */}
      
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <View style={styles.leftSection}>
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
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconNav}
            onPress={() => navigation?.navigate("Form")}
          >
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.iconLabel}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconNav}>
            <Text style={styles.icon}>❓</Text>
            <Text style={styles.iconLabel}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logoRow: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    zIndex: 10,
  },
  logo: {
    width: 110,
    height: 38,
  },
  navbar: {
    backgroundColor: "#0C2D87",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
    justifyContent: "space-between",
    elevation: 2,
    zIndex: 9,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  navItem: {
    marginRight: 28,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  navText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 17,
    opacity: 0.88,
    letterSpacing: 0.5,
  },
  navTextActive: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#FFDC00",
    opacity: 1,
    letterSpacing: 0.6,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginLeft: 12,
  },
  iconNav: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  icon: {
    color: "#fff",
    marginRight: 5,
    fontSize: 21,
  },
  iconLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.93,
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