// components/collection.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import { useDairy } from './context';

export default function DailyCollectionForm() {
  const { suppliers } = useDairy();

  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fat, setFat] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    const items = suppliers.map((sup, index) => ({
      label: sup.Supplier_name,
      value: index.toString(),
    }));
    setDropdownItems(items);
  }, [suppliers]);

  const handleAdd = () => {
  if (!selectedSupplier || !quantity || !fat || !rate) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  const supplier = suppliers.find((_, idx) => idx.toString() === selectedSupplier);
  console.log('Selected index:', selectedSupplier);
  console.log('Supplier object:', supplier);

  if (!supplier || !supplier.Supplier_name) {
    Alert.alert('Error', 'Invalid supplier selected');
    return;
  }

  const price = parseFloat(rate) * parseFloat(quantity);

  const collectionData = {
    selectedSupplier: supplier.Supplier_name, // ✅ validated
    quantity: parseFloat(quantity),
    fat: parseFloat(fat),
    rate: parseFloat(rate),
    price,
    date: new Date().toISOString(),
  };

  push(ref(db, 'collections/'), collectionData)
    .then(() => {
      setRate('');
      setQuantity('');
      setFat('');
      setSelectedSupplier(null);
      Alert.alert('Success', 'Collection submitted');
    })
    .catch((error) => {
      console.error('Push error:', error);
      Alert.alert('Error', 'Failed to submit collection');
    });
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Daily Collection Log</Text>

      <DropDownPicker
        open={dropdownOpen}
        value={selectedSupplier}
        items={dropdownItems}
        setOpen={setDropdownOpen}
        setValue={setSelectedSupplier}
        setItems={setDropdownItems}
        placeholder="Select Supplier"
        containerStyle={{ marginBottom: 10 }}
        style={{ borderColor: '#D1D5DB' }}
        dropDownContainerStyle={{ backgroundColor: '#fff' }}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity (Liters)"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TextInput
        style={styles.input}
        placeholder="Fat %"
        keyboardType="numeric"
        value={fat}
        onChangeText={setFat}
      />

      <TextInput
        style={styles.input}
        placeholder="Rate per Liter"
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
