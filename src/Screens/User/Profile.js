import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const UserPage = () => {
  const navigation = useNavigation();
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile info
  const [name, setName] = useState("Abdul Aliyy");
  const [role, setRole] = useState("⚽ Programmer & Footballer");
  const [bio, setBio] = useState(
    "I love football and programming. Always learning, always playing! 🚀"
  );

  // Toggles for Add Collection
  const [showSNF, setShowSNF] = useState();
  const [showFat, setShowFat] = useState();

  // Load profile & settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snf = await AsyncStorage.getItem("showSNF");
        const fat = await AsyncStorage.getItem("showFat");
        const savedName = await AsyncStorage.getItem("profileName");
        const savedRole = await AsyncStorage.getItem("profileRole");
        const savedBio = await AsyncStorage.getItem("profileBio");

        setShowSNF(snf !== null ? JSON.parse(snf) : false);
        setShowFat(fat !== null ? JSON.parse(fat) : false);
        if (savedName) setName(savedName);
        if (savedRole) setRole(savedRole);
        if (savedBio) setBio(savedBio);
      } catch (e) {
        console.log("Error loading settings:", e);
      }
    };
    loadSettings();
  }, []);

  // Save toggles & profile automatically
  useEffect(() => {
    AsyncStorage.setItem("showSNF", JSON.stringify(showSNF));
    AsyncStorage.setItem("showFat", JSON.stringify(showFat));
    AsyncStorage.setItem("profileName", name);
    AsyncStorage.setItem("profileRole", role);
    AsyncStorage.setItem("profileBio", bio);
  }, [showSNF, showFat, name, role, bio]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    setShowConfirm(false);
    Toast.show({
      type: "error",
      text1: "Logged out 👋",
      text2: "Come back soon!",
    });
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: "#ff4d4d" }]}
          onPress={() => setShowConfirm(true)}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Ionicons name="person-circle-outline" size={100} color="#007bff" />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Collection Settings</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show SNF %</Text>
          <Switch value={showSNF} onValueChange={setShowSNF} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show Fat %</Text>
          <Switch value={showFat} onValueChange={setShowFat} />
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalMessage}>
              You will be logged out of your account.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#eee" }]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={{ color: "#333", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ff4d4d" }]}
                onPress={handleLogout}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: 100,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },

  // Profile
  profileSection: { alignItems: "center", marginTop: 30 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 10, color: "#222" },
  role: { fontSize: 16, color: "#666", marginBottom: 12 },
  bio: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  // Settings
  settingsSection: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007bff",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  toggleLabel: { fontSize: 16, color: "#333" },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default UserPage;
