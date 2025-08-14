import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDairy } from './context';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import moment from 'moment';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function ReportScreen() {
  const { suppliers } = useDairy();
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

  const [filteredData, setFilteredData] = useState([]);

  


  const handleGenerateReport = () => {
    if (!supplierValue || !startDate || !endDate || !reportValue) {
      alert('Please select all options');
      return;
    }

    const collectionsRef = ref(db, 'collections');
    onValue(collectionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const all = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const filtered = all.filter((item) => {
          const itemDate = moment(item.date, ['DD/MM/YYYY', 'DD MMMM, YYYY', moment.ISO_8601]);
          return (
            item.selectedSupplier === supplierValue &&
            itemDate.isValid() &&
            itemDate.isBetween(
              moment(startDate).startOf('day'),
              moment(endDate).endOf('day'),
              null,
              '[]'
            )
          );
        });

        setFilteredData(filtered);
      } else {
        setFilteredData([]);
      }
    });
  };

  const totalMilk = filteredData.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalFat = filteredData.reduce((sum, item) => sum + (item.fat || 0), 0);
  const totalAmount = filteredData.reduce((sum, item) => sum + Number(item.price || 0), 0);

  // Build table rows dynamically from filteredData
const tableRows = filteredData.map(item => `
  <tr>
    <td>${moment(item.date).format('DD/MM/YYYY')}</td>
    <td>${item.quantity || '-'}</td>
    <td>${item.fat || '-'}</td>
    <td>${item.price || '-'}</td>
  </tr>
`).join('');

const html = `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      h1 {
        text-align: center;
        color: #333;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: center;
      }
      th {
        background-color: #f4f4f4;
      }
      tfoot td {
        font-weight: bold;
        background-color: #f9f9f9;
      }
    </style>
  </head>
  <body>
    <h1>Report for ${supplierValue}</h1>
    <p><strong>Report Type:</strong> ${reportValue}</p>
    <p><strong>Date Range:</strong> ${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')}</p>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Milk (Liters)</th>
          <th>Fat (%)</th>
          <th>Price (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
      <tfoot>
        <tr>
          <td>Total</td>
          <td>${totalMilk}</td>
          <td>${totalFat.toFixed(2)}</td>
          <td>₹${totalAmount}</td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>
`;

  const GeneratePdf =async ()=>{
      const file = await printToFileAsync({
        html: html,
        base64:false
      })
      await shareAsync(file.uri);
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartDatePickerVisibility(true)}>
          <Text >{startDate ? moment(startDate).format('DD MMM, YYYY') : 'Start Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndDatePickerVisibility(true)}>
          <Text >{endDate ? moment(endDate).format('DD MMM, YYYY') : 'End Date'}</Text>
        </TouchableOpacity>
      </View>

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
          setEndDatePickerVisibility(false);
        }}
        onCancel={() => setEndDatePickerVisibility(false)}
        
      />

      {/* Supplier Dropdown */}
      <View style={{ zIndex: 1000, margin: 10 }}>
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

      {/* Generate Button */}
      <TouchableOpacity style={styles.button} onPress={handleGenerateReport}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>

      {/* Summary */}
      {filteredData.length > 0 && (
        <View style={{ paddingHorizontal: 16, marginTop: 12, flexDirection:'row', justifyContent:'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
            {reportValue === 'milk'
              ? `Total Milk: ${totalMilk} Liters`
              : `Total Fat: ${totalFat.toFixed(2)} %`}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
            Total Amount ₹{totalAmount}
          </Text>
        </View>
      )}

      {/* Report List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity style={styles.button} onPress={GeneratePdf}>
            <Text style={styles.buttonText}>Generate PDF</Text>
          </TouchableOpacity>
          <View style={styles.reportCard}>
            <Text style={styles.cardText}>Date: {moment(item.date).format('DD/MM/YYYY')}</Text>
            <Text style={styles.cardText}>
              {reportValue === 'milk'
                ? `Milk: ${item.quantity} Liters`
                : `Fat%: ${item.fat}`}
            </Text>
          </View>
          </View>
        )}
      />
    </SafeAreaView>
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
    borderColor:'#dce5dc',
    borderWidth:1,
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
});
