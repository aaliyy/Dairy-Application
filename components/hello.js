import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import { useDairy } from './context';
import { useNavigation } from '@react-navigation/native';

export default function AddSupplierForm() {
   const navigation = useNavigation();
  const { addSupplier } = useDairy();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !location.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
 navigation.navigate('Home');
    // Local context update
    addSupplier({
      Supplier_name: name.trim(),
      location: location.trim(),
      number: phone.trim(), // store phone directly
    });

    // Firebase push
    push(ref(db, 'suppliers/'), {
      Supplier_name: name.trim(),
      location: location.trim(),
      number: phone.trim(), // store phone directly
    });

    // Clear input fields
    setName('');
    setLocation('');
    setPhone('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Supplier</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Supplier</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});