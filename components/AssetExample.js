// AssetExample.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList,ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDairy } from './context';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { collections, suppliers,loading } = useDairy();

  const totalFat = collections.reduce((sum, item) => sum + Number(item.fat || 0), 0);
  const avgFat = collections.length > 0 ? totalFat / collections.length : 0;
  const totalLiters = collections.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalAmount = collections.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const recentCollection = collections.slice(0, 2);
  if (loading) return <ActivityIndicator />;
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Salman Dairy</Text>
          <Text style={styles.subtitle}>Collection Center</Text>
        </View>
        <Ionicons name="person-circle-outline" size={32} color="gray" />
      </View>

      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Good Morning, Salman</Text>
        <Text style={styles.subtitle}>Today's collection overview</Text>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLarge}>{totalLiters.toFixed(1)} L</Text>
            <Text style={styles.subtitle}>Total collected</Text>
          </View>
          <View>
            <Text style={[styles.statLarge, { color: '#22C55E' }]}>₹{totalAmount.toFixed(2)}</Text>
            <Text style={styles.subtitle}>Today's value</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{suppliers.length}</Text>
            <Text style={styles.subtitle}>Active Suppliers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{avgFat.toFixed(2)}%</Text>
            <Text style={styles.subtitle}>Avg Fat Content</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.actionButton, styles.blueButton]} onPress={() => navigation.navigate('Suppliers')}>
            <Text style={styles.darkButtonText}>Suppliers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.greenButton]} onPress={() => navigation.navigate('AddSupplier')}>
            <Text style={styles.buttonText}>Add Supplier</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.actionButton, styles.yellowButton]} onPress={() => navigation.navigate('Daily Collection')}>
            <Text style={styles.buttonText}>Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.grayButton]} onPress={() => navigation.navigate('Report')}>
            <Text style={styles.darkButtonText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Collections */}
      <View style={styles.quickActionsContainer}>
        <View style={styles.statsRow}>
          <Text style={styles.sectionTitle}>Recent Collections</Text>
          <TouchableOpacity  onPress={() => navigation.navigate('AllCollections')}>
          <Text style={[styles.subtitle, { color: '#3B82F6' }]}>View All</Text>
        </TouchableOpacity>
        </View>
        <FlatList
          data={recentCollection}
          renderItem={({ item }) => (
            <View style={styles.listCard}>
              <Text style={styles.listName}>{item.selectedSupplier}</Text>
              <Text style={styles.subtitle}>{item.quantity} L</Text>
              <Text>{new Date(item.date).toLocaleDateString('en-GB')}</Text>
              <Text style={styles.amount}>₹{item.price}</Text>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
</View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  subtitle: { fontSize: 12, color: '#6B7280' },
  overviewCard: {
    backgroundColor: '#E0F2FE', borderRadius: 20, padding: 16, marginBottom: 16,
  },
  overviewTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  statLarge: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statCard: {
    backgroundColor: '#fff', padding: 12, borderRadius: 12, width: '48%',
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3, elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  quickActionsContainer: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  actionButton: {
    padding: 16, borderRadius: 12, width: '48%', alignItems: 'center',
  },
  greenButton: { backgroundColor: '#22C55E' },
  blueButton: { backgroundColor: '#BFDBFE' },
  yellowButton: { backgroundColor: '#FACC15' },
  grayButton: { backgroundColor: '#F3F4F6' },
  buttonText: { color: '#fff', fontWeight: '600' },
  darkButtonText: { color: '#111827', fontWeight: '600' },
  listCard: {
    backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12, marginBottom: 8,
  },
  listName: { fontWeight: '600', fontSize: 14, color: '#111827' },
  amount: { fontWeight: 'bold', color: '#16A34A', textAlign: 'right', marginTop: 4 },
});
