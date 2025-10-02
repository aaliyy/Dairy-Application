import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [otp, setOtp] = useState(""); // generated OTP
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // Refs for OTP inputs
  const inputRefs = useRef([]);

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

  // Generate 6-digit OTP
  const generateOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(randomOtp);
    return randomOtp;
  };

  const handleSendOTP = async () => {
    if (phoneNumber.trim() === "" || phoneNumber.length !== 10) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmation(true);

      const newOtp = generateOtp();

      Toast.show({
        type: "success",
        text1: "OTP Sent 🚀",
        text2: `Your OTP is ${newOtp}`, // for testing
      });
    }, 1000);
  };

  const handleOtpChange = (text, index) => {
    if (/^\d$/.test(text) || text === "") {
      const newInputs = [...otpInputs];
      newInputs[index] = text;
      setOtpInputs(newInputs);

      if (text && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      if (!text && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleConfirmOTP = async () => {
    const enteredOtp = otpInputs.join("");
    if (enteredOtp === otp) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      Toast.show({
        type: "success",
        text1: "Login Successful 🎉",
      });
      navigation.replace("MainTabs");
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                    maxLength={10}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSendOTP}
                  >
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.section}>
                  <Text style={styles.title}>Enter OTP</Text>
                  <View style={styles.otpContainer}>
                    {otpInputs.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                      />
                    ))}
                  </View>
                  <View style={{ width: "100%", flexDirection:'row', justifyContent:'space-between' }}>
                  <TouchableOpacity
                    style={styles.OTPbutton}
                    onPress={handleConfirmOTP}
                  >
                    <Text style={styles.buttonText}>Confirm OTP</Text>
                  </TouchableOpacity>
                   <TouchableOpacity
                    style={styles.OTPbutton}
                    onPress={handleSendOTP}
                  >
                    <Text style={styles.buttonText}> Resend OTP</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#f1f3f6",
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
   OTPbutton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    elevation: 2,
    margin:5,
  },
});
