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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function DailyCollectionForm({ route }) { // ✅ Add route parameter
  const { suppliers } = useDairy();
  const { supplierId } = route?.params || {}; // ✅ Get supplierId from QR deep link

  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fat, setFat] = useState('');
  const [date, setDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const items = suppliers.map((sup, index) => ({
      label: sup.Supplier_name,
      value: index.toString(),
    }));
    setDropdownItems(items);

    // ✅ Auto-select supplier if came from QR code
    if (supplierId && suppliers.length > 0) {
      // Find supplier by ID (assuming supplierId matches the supplier's ID or index)
      const supplierIndex = suppliers.findIndex(
        (supplier, index) => 
          supplier.id === supplierId || 
          supplier.Supplier_name === supplierId ||
          index.toString() === supplierId
      );

      if (supplierIndex !== -1) {
        setSelectedSupplier(supplierIndex.toString());
        
        // Show confirmation that QR code worked
       
      } else {
        Alert.alert(
          'QR Code Info',
          `Supplier ID: ${supplierId} - Please select manually`,
          [{ text: 'OK' }]
        );
      }
    }
  }, [suppliers, supplierId]);

  const handleAdd = () => {
    if (!selectedSupplier || !quantity || !fat || !rate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const supplier = suppliers.find((_, idx) => idx.toString() === selectedSupplier);

    if (!supplier || !supplier.Supplier_name) {
      Alert.alert('Error', 'Invalid supplier selected');
      return;
    }

    const price = parseFloat(rate) * parseFloat(quantity);

    const collectionData = {
      selectedSupplier: supplier.Supplier_name,
      supplierId: supplierId || null, // ✅ Store original supplierId if from QR
      quantity: parseFloat(quantity),
      fat: parseFloat(fat),
      rate: parseFloat(rate),
      price,
      date: date.toISOString(),
      source: supplierId ? 'qr_code' : 'manual', // ✅ Track how entry was created
    };

    push(ref(db, 'collections/'), collectionData)
      .then(() => {
        setRate('');
        setQuantity('');
        setFat('');
        setSelectedSupplier(null);
        setDate(new Date());
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
        style={{ 
          borderColor: '#D1D5DB',
          backgroundColor: supplierId ? '#f0f9ff' : '#fff' // ✅ Highlight if from QR
        }}
        dropDownContainerStyle={{ backgroundColor: '#fff' }}
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setDatePickerVisibility(true)}
      >
        <Text>{moment(date).format('DD MMM, YYYY')}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity (Pounds)"
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
  qrBanner: { // ✅ New style for QR indicator
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeft: 4,
    borderLeftColor: '#3b82f6',
  },
  qrText: {
    color: '#1e40af',
    fontWeight: '500',
    textAlign: 'center',
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
});
