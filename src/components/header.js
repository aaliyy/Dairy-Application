import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDairy } from './context';

const Header = () => {
  const { collections, suppliers } = useDairy();
  const totalFat = collections.reduce((sum, item) => sum + Number(item.fat || 0), 0);
  const avgFat = collections.length > 0 ? totalFat / collections.length : 0;
  const totalLiters = collections.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalAmount = collections.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <View style={{
    borderWidth:1,
    borderColor:'#d3d3d3',
    shadowColor: '#d3d3d3',
    shadowOpacity: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 20,
    elevation: 5,
    borderRadius:20,
    marginBottom: 16
    }}>
    <LinearGradient
      colors={['#98D0F9', '#F6F6F6']} // Gradient from light blue to darker blue
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.overviewCard}
    >
      <Text style={styles.overviewTitle}>Good Morning, Salman</Text>
      <Text style={styles.subtitle}>Today's collection overview</Text>

      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statLarge}>{totalLiters.toFixed(1)} L</Text>
          <Text style={styles.subtitle}>Total collected</Text>
        </View>
        <View>
          <Text style={[styles.statLarge, { color: '#22C55E' }]}>
            ₹{totalAmount.toFixed(2)}
          </Text>
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
    </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  overviewCard: {
    borderRadius: 20,
    padding: 16,
    
   
  },
  overviewTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#000' },
  subtitle: { color: '#000', fontSize: 12 },
  statLarge: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statCard: {
    backgroundColor: '#98D0F9',
    padding: 12,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#fff',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    borderWidth:1,
    borderColor:'#fff'
  },
  statValue: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
});

export default Header;
