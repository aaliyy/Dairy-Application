import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useDairy } from './context';
import { useNavigation } from '@react-navigation/native';

export default function SupplierScreen() {
  const navigation = useNavigation();
  const { suppliers, Delete_Suppliers } = useDairy();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('QR', { supplierId: item.id })}
      onLongPress={() => Delete_Suppliers(item)}
    >
      <Text style={styles.name}>{item.Supplier_name}</Text>
      <Text style={styles.details}>{item.location}</Text>
      <Text style={styles.details}>{item.number}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[...suppliers].sort((a, b) => new Date(b.date) - new Date(a.date))}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
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
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 5,
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
