import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Linking } from 'react-native';

export default function SupplierDetails({ route }) {
  const { supplierId } = route.params;
  
  // Create deep link for Daily Collection
  const qrValue = `dairyapp://daily-collection/123`;

  // ✅ Add test button to manually trigger deep link
  const testDeepLink = () => {
    console.log('Testing deep link:', qrValue);
    
    Linking.canOpenURL(qrValue).then((supported) => {
      if (supported) {
        Linking.openURL(qrValue);
      } else {
        Alert.alert('Error', 'Cannot open this URL scheme');
      }
    }).catch((err) => {
      console.error('Deep link error:', err);
      Alert.alert('Error', `Deep link failed: ${err.message}`);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supplier QR Code</Text>
      <Text style={styles.supplierId}>ID: {supplierId}</Text>
      
      <QRCode value={qrValue} size={300} />
      
      <Text style={styles.qrText}>{qrValue}</Text>
      
      {/* ✅ Test button for debugging */}
      <TouchableOpacity style={styles.testButton} onPress={testDeepLink}>
        <Text style={styles.testButtonText}>Test Deep Link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  supplierId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  qrText: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  testButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});