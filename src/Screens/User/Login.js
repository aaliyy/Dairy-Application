import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { auth } from "../firebase";
import { signInWithPhoneNumber } from "firebase/auth";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [code, setCode] = useState("");

  const handleSendOTP = async () => {
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber);
      setConfirmation(result);
      Alert.alert("OTP Sent", "Check your phone for OTP");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleConfirmOTP = async () => {
    try {
      await confirmation.confirm(code);
      Alert.alert("Success", "Phone authentication successful!");
      // onAuthStateChanged in App.js will automatically redirect to Home
    } catch (error) {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      {!confirmation ? (
        <>
          <TextInput
            placeholder="+91 9876543210"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Button title="Send OTP" onPress={handleSendOTP} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Button title="Confirm OTP" onPress={handleConfirmOTP} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 18, padding: 10 },
});
