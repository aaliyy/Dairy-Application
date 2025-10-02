import React from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useDairy } from "../../components/context";

export default function SupplierDetails({ route }) {
  const { supplierId, supplierIndex, suppliersName } = route.params || {};
  const { collections = [] } = useDairy();
  const navigation = useNavigation();

  const qrValue = `dairyapp://daily-collection/${supplierIndex !== undefined ? supplierIndex : supplierId}`;

  const supplierCollections = collections.filter(
    c => c.supplierId === supplierId || c.supplier_id === supplierId || c.Supplier_id === supplierId
  );

  const totalLiters = supplierCollections.reduce(
    (sum, c) => sum + (parseFloat(c?.quantity) || 0),
    0
  );
  const totalAmount = supplierCollections.reduce(
    (sum, c) => sum + (parseFloat(c?.price) || 0),
    0
  );

  // ✅ Active / Inactive function
  const active = () => {
    if (!supplierCollections || supplierCollections.length === 0) {
      return <Text style={styles.inactive}>● Inactive</Text>;
    } else {
      return <Text style={styles.active}>● Active</Text>;
    }
  };
  // ✅ Active / Inactive function with 4-day rule
// const active = () => {
//   if (!supplierCollections || supplierCollections.length === 0) {
//     return <Text style={styles.inactive}>● Inactive</Text>;
//   }

//   // find last collection date
//   const lastCollection = supplierCollections.reduce((latest, c) => {
//     const date = new Date(c?.date || c?.timestamp); // make sure collection has `date` or `timestamp`
//     return date > latest ? date : latest;
//   }, new Date(0));

//   // check difference in days
//   const now = new Date();
//   const diffDays = Math.floor((now - lastCollection) / (1000 * 60 * 60 * 24));

//   if (diffDays >= 4) {
//     return <Text style={styles.inactive}>● Inactive</Text>;
//   }

//   return <Text style={styles.active}>● Active</Text>;
// };


  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Supplier Header */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(suppliersName || "??").substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.supplierName}>{suppliersName}</Text>
            <Text style={styles.supplierId}>Supplier ID: {supplierId}</Text>
            {active()}
          </View>
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Supplier QR Code</Text>
        <View style={styles.qrContainer}>
          <QRCode value={qrValue} size={200} />
        </View>
    
      </View>

      {/* Collection Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Collection Summary</Text>
        <View style={styles.row}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Total Liters Collected</Text>
            <Text style={styles.summaryValue}>{totalLiters} L</Text>
            <Text style={styles.tag}>This Month</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Total Amount</Text>
            <Text style={styles.summaryValue}>₹ {totalAmount}</Text>
            <Text style={styles.tag}>This Month</Text>
          </View>
        </View>
      </View>

      {/* Record Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('MainTabs', {
          screen: 'Daily Collection',
          params: { supplierId, suppliersName },
        })}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.primaryButtonText}>Record New Collection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 22 },
  supplierName: { fontSize: 18, fontWeight: '600', color: '#111827' },
  supplierId: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  active: { fontSize: 13, color: '#10B981', marginTop: 2 },
  inactive: { fontSize: 13, color: '#ef4444', marginTop: 2 }, // 🔴 red for inactive
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#111827' },
  qrContainer: { alignItems: 'center', marginBottom: 12 },
  downloadBtn: {
    backgroundColor: '#2563eb', paddingVertical: 10,
    borderRadius: 8, alignItems: 'center',
  },
  downloadText: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryBox: { flex: 1, marginHorizontal: 5, backgroundColor: '#f9fafb', padding: 12, borderRadius: 10 },
  summaryTitle: { fontSize: 13, color: '#6b7280' },
  summaryValue: { fontSize: 18, fontWeight: '700', marginTop: 4, color: '#111827' },
  tag: { fontSize: 12, marginTop: 2, color: '#10B981' },
  primaryButton: {
    flexDirection: 'row', backgroundColor: '#10B981',
    paddingVertical: 14, borderRadius: 10, alignItems: 'center',
    justifyContent: 'center', marginTop: 10,
  },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 15, marginLeft: 8 },
});
