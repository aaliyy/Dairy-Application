import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDairy } from './context';

export default function SupplierScreen() {
  const { suppliers } = useDairy();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.Supplier_name}</Text>
      <Text style={styles.details}>{item.location}</Text>
      <Text style={styles.details}>{item.number}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={suppliers.sort((a, b) => new Date(b.date) - new Date(a.date))}
        renderItem={renderItem}
        keyExtractor={(index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F3F4F6',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop:5,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  details: {
    fontSize: 14,
    color: '#6B7280',
  },
});
