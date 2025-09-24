import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList ,StatusBar} from 'react-native';
import QRCode from 'react-native-qrcode-svg';


export default function SupplierDetails({ route }) {
  const { supplierId, supplierIndex, supplierName } = route.params || {};
  const qrValue = `dairyapp://daily-collection/${supplierIndex !== undefined ? supplierIndex : supplierId}`;

 

  return (
    <View style={styles.container}>
         <StatusBar hidden={true} />
      <Text style={styles.title}>Supplier QR Code</Text>

      {supplierName && (
        <Text style={styles.supplierName}>{supplierName}</Text>
      )}
      <View style={styles.qrContainer}>
        <QRCode value={qrValue} size={300} />
      </View>
      <Text style={styles.instructionText}>
        Scan with your phone's camera or any QR scanner app
      </Text>

      {/* ✅ Added Totals */}
     
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  supplierId: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  qrText: {
    marginTop: 10,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  testButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  testButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  instructionText: {
    marginTop: 20,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  summary: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  item: {
    padding: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  date: {
    fontWeight: 'bold',
  },
});
