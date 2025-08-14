import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
  Vibration,
  Dimensions,
  Modal,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // ✅ Added

const { width, height } = Dimensions.get('window');

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation(); // ✅ Added

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData({ type, data });
    Vibration.vibrate(100);

    // ✅ If deep link for Dairy App
    if (data.startsWith('dairyapp://daily-collection/')) {
      const supplierId = data.replace('dairyapp://daily-collection/', '');
      navigation.navigate('Daily Collection', { supplierId });
     
    }

    
  };

  const handleOpenLink = async (data) => {
    const urlPattern = /^(https?:\/\/)/i;

    if (urlPattern.test(data)) {
      const supported = await Linking.canOpenURL(data);
      if (supported) {
        await Linking.openURL(data);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } else {
      Alert.alert('Not a URL', 'The scanned code is not a valid web link');
    }
    setScanned(false);
  };

  const toggleTorch = () => {
    setTorch(!torch);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Scan QR Code</Text>
            <TouchableOpacity onPress={toggleTorch} style={styles.flashButton}>
              <Ionicons 
                name={torch ? 'flash' : 'flash-off'} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          {/* Scanning Frame */}
          <View style={styles.scanningContainer}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.scanLine} />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Position the QR code within the frame to scan
            </Text>
            {scannedData && (
              <TouchableOpacity 
                style={styles.button}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  flashButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 25 },
  scanningContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, position: 'relative', backgroundColor: 'transparent' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#00ff00', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0 },
  scanLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: '#00ff00', opacity: 0.8 },
  instructions: { paddingBottom: 50, paddingHorizontal: 20, alignItems: 'center' },
  instructionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  text: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});