import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Pressable,StatusBar } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import { useDairy } from '../../components/context';
import { Ionicons } from '@expo/vector-icons';

export default function ReportScreen({ navigation }) {
  const { suppliers } = useDairy();

  const [isToday, setIsToday] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportValue, setReportValue] = useState(null);
  const [reportItems, setReportItems] = useState([
    { label: 'Milk', value: 'milk' },
    { label: 'Fat%', value: 'fat' },
  ]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const [supplierOpen, setSupplierOpen] = useState(false);
  const [supplierValue, setSupplierValue] = useState(null);
  const items = suppliers.map((sup) => ({
    label: sup.Supplier_name,
    value: sup.Supplier_name,
  }));

  const handleSingleDay = (value) => {
    setIsToday(value);
  };

  const handleGenerateReport = () => {
    if (!startDate || !endDate || !reportValue) {
      alert('Please select date range and report type');
      return;
    }

    // Navigate to ViewReportScreen and pass filters as params
    navigation.navigate('ViewReport', {
      startDate,
      endDate,
      reportValue,
      supplierValue,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
         <StatusBar hidden={true} />
      <TouchableOpacity onPress={ ()=>navigation.navigate('Home') } style={{ marginTop: 30,margin:10, marginBottom:2, }}>
  <Ionicons name="arrow-back" size={24} color="black" />
</TouchableOpacity>
      <View style={styles.toggleContainer}>
        <Pressable
          onPress={() =>handleSingleDay(true)}
          style={[styles.toggleButton, isToday && styles.toggleActive]}>
          <Text style={[styles.toggleText, { color: isToday ? 'black' : 'grey' }]}>Single Day</Text>
        </Pressable>
        <Pressable
          onPress={() =>handleSingleDay(false)}
          style={[styles.toggleButton, !isToday && styles.toggleActive]}>
          <Text style={[styles.toggleText, { color: !isToday ? 'black' : 'grey' }]}>Multi-Day</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Generate Reports</Text>

      {/* Report Type Dropdown */}
      <View style={{ zIndex: 3000, margin: 10 }}>
        <DropDownPicker
          open={reportOpen}
          value={reportValue}
          items={reportItems}
          setOpen={setReportOpen}
          setValue={setReportValue}
          setItems={setReportItems}
          placeholder="Select Report Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
          placeholderStyle={styles.placeholder}
        />
      </View>

      {/* Date Pickers */}
      {!isToday && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setStartDatePickerVisibility(true)}>
            <Text>{startDate ? moment(startDate).format('DD MMM, YYYY') : 'Start Date'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setEndDatePickerVisibility(true)}>
            <Text>{endDate ? moment(endDate).format('DD MMM, YYYY') : 'End Date'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isToday && (
        <TouchableOpacity
          style={[styles.dateButtonS, { marginHorizontal: 16 }]}
          onPress={() => setEndDatePickerVisibility(true)}>
          <Text>{endDate ? moment(endDate).format('DD MMM, YYYY') : 'Select Date'}</Text>
        </TouchableOpacity>
      )}

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartDate(date);
          setStartDatePickerVisibility(false);
        }}
        onCancel={() => setStartDatePickerVisibility(false)}
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndDate(date);
          if (isToday) setStartDate(date);
          setEndDatePickerVisibility(false);
        }}
        onCancel={() => setEndDatePickerVisibility(false)}
      />

      {/* Supplier Dropdown */}
      <View style={{ zIndex: 1000, margin: 10 }}>
        <DropDownPicker
          open={supplierOpen}
          value={supplierValue}
          items={[{ label: 'All Suppliers', value: null }, ...items]}
          setOpen={setSupplierOpen}
          setValue={setSupplierValue}
          placeholder="Select Supplier (Optional)"
          searchable
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGenerateReport}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111711',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#dce5dc',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 12,
  },
  dropdownBox: {
    borderColor: '#dce5dc',
  },
  placeholder: {
    color: '#648764',
    fontSize: 16,
  },
  button: {
    marginHorizontal: 16,
    backgroundColor: '#22C55E',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 8,
    borderColor: '#dce5dc',
    borderWidth: 1,
  },
   dateButtonS : {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 8,
    borderColor: '#dce5dc',
    borderWidth: 1,
  },
  reportCard: {
    backgroundColor: '#f3fef3',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    borderColor: '#c4f3c4',
    borderWidth: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '90%',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    padding: 5,
    borderRadius: 20,
    height: 40,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  toggleButton: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  toggleActive: {
    backgroundColor: '#d3d3d3',
  },
  toggleText: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  // New styles for supplier cards
 
});