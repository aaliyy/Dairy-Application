import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // Auto check login
  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn) {
        navigation.replace("Home");
      }
    };
    checkLogin();
  }, []);

  const handleSendOTP = async () => {
    if (phoneNumber.trim() === "") {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmation(true);

      // Show toast instead of alert
      Toast.show({
        type: "success",
        text1: "OTP Sent 🚀",
        text2: "Your OTP is 123456",
      });
    }, 1000);
  };

  const handleConfirmOTP = async () => {
    if (code === "123456") {
      await AsyncStorage.setItem("isLoggedIn", "true");
      Toast.show({
        type: "success",
        text1: "Login Successful 🎉",
      });
      navigation.replace("Home");
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid OTP ❌",
        text2: "Please enter the correct OTP",
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={styles.openButton}
      >
        <Text style={styles.openButtonText}>Login</Text>
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={isVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            {!confirmation ? (
              <View style={styles.section}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.title}>Enter OTP</Text>
                <TextInput
                  placeholder="123456"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleConfirmOTP}
                >
                  <Text style={styles.buttonText}>Confirm OTP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  openButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    elevation: 2,
  },
  openButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
   
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    elevation: 5,
  },
  section: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#f1f3f6",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#888",
  },
});
