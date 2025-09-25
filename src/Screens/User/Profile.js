import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";

const UserPage = () => {
  const navigation = useNavigation();
  const [showConfirm, setShowConfirm] = useState(false);

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
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 26 }} /> 
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Ionicons name="person-circle-outline" size={100} color="#007bff" />
        <Text style={styles.name}>Abdul Aliyy</Text>
        <Text style={styles.role}>{"⚽ Programmer & Footballer"}</Text>
        <Text style={styles.bio}>
          I love football and programming. Always learning, always playing! 🚀
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => setShowConfirm(true)}
        >
          <Text style={styles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
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
            <Text style={styles.modalMessage}>You will be logged out of your account.</Text>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, height: 100,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  profileSection: { alignItems: 'center', marginTop: 30, paddingHorizontal: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#222' },
  role: { fontSize: 16, color: '#666', marginBottom: 12 },
  bio: { fontSize: 14, textAlign: 'center', color: '#333', marginHorizontal: 20, marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 20 },
  primaryButton: {
    backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, elevation: 2,
  },
  primaryButtonText: { color: '#fff', fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: '#eee', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, elevation: 2,
  },
  secondaryButtonText: { color: '#333', fontWeight: 'bold' },

  // Modal styles
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 25,
    width: '80%', alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  modalMessage: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: {
    flex: 1, paddingVertical: 12, marginHorizontal: 5,
    borderRadius: 8, alignItems: 'center',
  },
});

export default UserPage;
