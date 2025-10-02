import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, StatusBar } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import { useDairy } from '../../components/context';
import { Ionicons,FontAwesome } from '@expo/vector-icons';

export default function ReportScreen({ navigation }) {
  const { suppliers } = useDairy();

  const [isToday, setIsToday] = useState(true);

  // Report type dropdown
 

  // Date pickers
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // Supplier dropdown
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [supplierValue, setSupplierValue] = useState(null);
  const items = suppliers.map((sup) => ({
    label: sup.Supplier_name,
    value: sup.Supplier_name,
  }));

  // Morning/Evening toggle
// null = all, 'morning' = morning, 'evening' = evening
const [timeFilterValue, setTimeFilterValue] = useState(null);


  const handleSingleDay = (value) => {
    setIsToday(value);
  };

  const handleGenerateReport = () => {
    if (!startDate || !endDate ) {
      alert('Please select date range and report type');
      return;
    }

    navigation.navigate('ViewReport', {
      startDate,
      endDate,
      supplierValue,
      timeFilterValue,
      isToday
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar hidden={true} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 30, margin: 10, marginBottom: 2 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Single Day / Multi-Day toggle */}
      <View style={styles.toggleContainer}>
        <Pressable onPress={() => handleSingleDay(true)} style={[styles.toggleButton, isToday && styles.toggleActive]}>
          <Text style={[styles.toggleText, { color: isToday ? '#3B82F6' : 'grey' }]}>Single Day</Text>
        </Pressable>
        <Pressable onPress={() => handleSingleDay(false)} style={[styles.toggleButton, !isToday && styles.toggleActive]}>
          <Text style={[styles.toggleText, { color: !isToday ? '#3B82F6' : 'grey' }]}>Multi-Day</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Generate Reports</Text>

      {/* Report Type Dropdown */}
      
      {/* Date Pickers */}
      {!isToday && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setStartDatePickerVisibility(true)}>
            <Text>{startDate ? moment(startDate).format('DD MMM, YYYY') : 'Start Date'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateButton} onPress={() => setEndDatePickerVisibility(true)}>
            <Text>{endDate ? moment(endDate).format('DD MMM, YYYY') : 'End Date'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isToday && (
        <TouchableOpacity style={[styles.dateButtonS, { marginHorizontal: 16 }]} onPress={() => setEndDatePickerVisibility(true)}>
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

      {/* Morning / Evening toggle */}
      <View style={styles.toggleContainers}>
  <TouchableOpacity
    onPress={() => setTimeFilterValue('morning')}
    style={[styles.toggleButtons, timeFilterValue === 'morning' && styles.toggleActives]}>
       <Ionicons name="sunny" size={16} color={"#6B7280"} />
    <Text style={[styles.toggleTexts, timeFilterValue === 'morning' && styles.toggleTextActives]}>
      Morning
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setTimeFilterValue('evening')}
    style={[styles.toggleButtons, timeFilterValue === 'evening' && styles.toggleActives]}>
      <Ionicons name="moon" size={16} color={"#6B7280"} />
    <Text style={[styles.toggleTexts, timeFilterValue === 'evening' && styles.toggleTextActives]}>
      Evening
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setTimeFilterValue(null)}
    style={[styles.toggleButtonsa, timeFilterValue === null && styles.toggleActives]}>
    <Text style={[styles.toggleTexts, timeFilterValue === null && styles.toggleTextActives]}>
      All
    </Text>
  </TouchableOpacity>
</View> 


      <TouchableOpacity style={styles.button} onPress={handleGenerateReport}>
        <FontAwesome name="file-text" size={24} color="#fff" />
        <View style={{marginLeft:20,}}>
        <Text style={styles.buttonText}>Get Report</Text>
        </View>
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
    backgroundColor: '#3B82F6',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor:'#3B82F6',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
    flexDirection:'row',
    width:'95%',
    alignSelf:'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 8,
    borderColor: '#dce5dc',
    borderWidth: 1,
  },
  dateButtonS: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 8,
    borderColor: '#dce5dc',
    borderWidth: 1,
    width:'95%',
    alignSelf:'center'
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '95%',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 2,
    borderRadius: 9,
    height: 50,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  toggleButton: {
    flex: 1,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  toggleActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk_400Regular',
    fontWeight:'bold'
  },
  toggleTextActive: {
    color: 'black',
    fontWeight: 'bold',
  },
   toggleContainers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginLeft:20,
    marginRight:20,
    width:'95%',
    alignSelf:'center',
    height:56,
  },
  toggleButtons: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    flexDirection:'row',
    justifyContent:'space-between',
    paddingRight:20,
  },
  toggleButtonsa: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    justifyContent:'center',
     paddingRight:20,
  },
  toggleActives: {
    backgroundColor: "#3B82F6",
  },
  toggleTexts: { fontSize: 16, color: "#6B7280", fontWeight: "500" },
  toggleTextActives: { color: "#fff", fontWeight: "700" },

});
