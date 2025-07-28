import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDairy } from './context'

export default function ReportScreen() {
  const { suppliers,collections  } = useDairy();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportValue, setReportValue] = useState(null);
  const [reportItems, setReportItems] = useState([

    { label: 'Milk', value: 'milk' },
    { label: 'Fat%', value: 'fat%' },
  ]);

  const [dateOpen, setDateOpen] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  const [dateItems, setDateItems] = useState([
  
    { label: 'Last 30 Days', value: 'Last30Days' },
    { label: 'Last 7 Days', value: 'Last7Days' },
  ]);

  const [supplierOpen, setSupplierOpen] = useState(false);
  const [supplierValue, setSupplierValue] = useState(null);
  const items = suppliers.map((sup, index) => ({
      label: sup.Supplier_name,
      value: index.toString(),
    }));


 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Text style={styles.title}>Generate Reports</Text>

        {/* Dropdowns */}
        <View style={{zIndex:3000, margin:10,}}>
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

        <View style={{zIndex:2000, margin:10,}}>
          <DropDownPicker
            open={dateOpen}
            value={dateValue}
            items={dateItems}
            setOpen={setDateOpen}
            setValue={setDateValue}
            setItems={setDateItems}
            placeholder="Select Date Range"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
            placeholderStyle={styles.placeholder}
          />
        </View>

        <View style={{zIndex:1000, margin:10,}}>
          <DropDownPicker
            open={supplierOpen}
            value={supplierValue}
            items={items}
            setOpen={setSupplierOpen}
            setValue={setSupplierValue}
            placeholder="Select Supplier"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
            placeholderStyle={styles.placeholder}
          />
        </View>

      
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>

        
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  
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
    color:'#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});