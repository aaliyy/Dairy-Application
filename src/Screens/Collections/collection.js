import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../../../firebase';
import { ref, push } from 'firebase/database';
import { useDairy } from '../../components/context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DailyCollectionForm({ route }) {
  const { suppliers } = useDairy();
  const { supplierId } = route?.params || {};
  const navigation = useNavigation();
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fat, setFat] = useState('');
  const [date, setDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      const items = suppliers.map((sup) => ({
        label: sup.Supplier_name,
        value: sup.id.toString()
      }));
      setDropdownItems(items);

      // Auto-select supplier if came from QR code
      if (supplierId) {
        const matchedSupplier = suppliers.find(
        supplier => supplier.id?.toString() === supplierId?.toString()
      );
        if (matchedSupplier) {
          setSelectedSupplier(matchedSupplier.id.toString());
        } else {
          console.log('No matching supplier found for ID:', supplierId);
          Alert.alert(
            '⚠️ QR Code Scanned',
            `Supplier ID: ${supplierId}\nPlease select manually from the dropdown`,
            [{ text: 'OK' }]
          );
        }
      }
    }
  }, [suppliers, supplierId]);

const handleAdd = () => {
    if (!selectedSupplier || !quantity || !fat || !rate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

     const supplier = suppliers.find(
      s => s.id?.toString() === selectedSupplier?.toString()
    );


    if (!supplier || !supplier.Supplier_name) {
      Alert.alert('Error', 'Invalid supplier selected');
      return;
    }

    const morningORevening = () => {
      if (date.getHours() < 12) {
        return 'Morning';
      }
      return 'Evening';
    }

    const price = parseFloat(rate) * parseFloat(quantity);
     navigation.navigate('Home');

    const collectionData = {
      selectedSupplier: supplier.Supplier_name,
      supplierId: supplierId || null,
      quantity: parseFloat(quantity),
      fat: parseFloat(fat),
      rate: parseFloat(rate),
      price,
      date: date.toISOString(),
      source: supplierId ? 'qr_code' : 'manual',
      morningORevening: morningORevening(),
    };

    push(ref(db, 'collections/'), collectionData)
      .then(() => {
        setRate('');
        setQuantity('');
        setFat('');
        setSelectedSupplier(null);
        setDate(new Date());
        morningORevening();
      })
      .catch((error) => {
        console.error('Push error:', error);
        Alert.alert('Error', 'Failed to submit collection');
      });
  };
  // Show loading state if suppliers haven't loaded yet
  if (!suppliers || suppliers.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>No Suppliers Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
   <StatusBar hidden={true} />
<TouchableOpacity onPress={ ()=>navigation.navigate('Home') } style={{ marginTop: 20, marginBottom:10, }}>
  <Ionicons name="arrow-back" size={24} color="black" />
</TouchableOpacity>
      {/* Show QR scan indicator */}
      <View style={styles.dropdownContainer}>
  
       <DropDownPicker
  open={dropdownOpen}
  value={selectedSupplier}
  items={dropdownItems}
  setOpen={setDropdownOpen}
  setValue={setSelectedSupplier}
  setItems={setDropdownItems}
  placeholder="Select Supplier"
  searchable={true} // ✅ Enables search
  searchPlaceholder="Search supplier..."
  style={{ 
    borderColor: '#D1D5DB',
    backgroundColor: supplierId ? '#f0f9ff' : '#fff',
    minHeight: 50,
  }}
  dropDownContainerStyle={{ 
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
  }}
  textStyle={{
    fontSize: 16,
    color: '#111827',
  }}
  searchTextInputStyle={{
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  }}
  zIndex={3000}
  zIndexInverse={1000}
/>


      </View>

     
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setDatePickerVisibility(true)}
      >
        <Text style={styles.dateButtonText}>
          {moment(date).format('DD MMM, YYYY')}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
        maximumDate={new Date()} // Prevent future dates
      />

    
      <TextInput
        style={styles.input}
        placeholder="Enter quantity in liters"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter fat percentage "
        keyboardType="numeric"
        value={fat}
        onChangeText={setFat}
        returnKeyType="next"
      />

  
      <TextInput
        style={styles.input}
        placeholder="Enter rate per liter"
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
        returnKeyType="done"
      />

      {/* Show calculated price */}
     

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Submit Collection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  qrBanner: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  qrText: {
    color: '#1e40af',
    fontWeight: '500',
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 15,
    zIndex: 3000,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    minHeight: 50,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  priceContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16 
  },
});