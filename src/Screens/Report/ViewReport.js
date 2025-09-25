import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView ,StatusBar} from 'react-native';
import { db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import moment from 'moment';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

export default function ViewReportScreen({ route }) {
  const { startDate, endDate, reportValue, supplierValue } = route.params;
  const [filteredData, setFilteredData] = useState([]);
  const [supplierNames, setSupplierNames] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch supplier names
    const suppliersRef = ref(db, 'suppliers');
    onValue(suppliersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const names = {};
        Object.keys(data).forEach(key => {
          names[key] = data[key].Supplier_name || data[key].name || 'Unknown';
        });
        setSupplierNames(names);
      }
    });

    // Fetch collections
    const collectionsRef = ref(db, 'collections');
    onValue(collectionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let all = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        const filtered = all.filter(item => {
          const itemDate = moment(item.date, ['DD/MM/YYYY', 'DD MMMM, YYYY', moment.ISO_8601]);
          const inRange = itemDate.isValid() &&
            itemDate.isBetween(moment(startDate).startOf('day'), moment(endDate).endOf('day'), null, '[]');
          if (!inRange) return false;
          if (supplierValue) return item.selectedSupplier === supplierValue;
          return true;
        });

        // Group by supplier if no supplier selected
        if (!supplierValue) {
          const grouped = filtered.reduce((acc, item) => {
            const sup = item.selectedSupplier || 'Unknown';
            acc[sup] = acc[sup] ? [...acc[sup], item] : [item];
            return acc;
          }, {});
          setFilteredData(grouped);
        } else {
          setFilteredData(filtered);
        }
      }
    });
  }, []);

  // Helper to count deliveries
  const deliveriesCount = () => {
    if (Array.isArray(filteredData)) {
      return filteredData.length;
    } else {
      return Object.values(filteredData).reduce((sum, arr) => sum + arr.length, 0);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalMilk = 0;
    let totalFat = 0;
    let totalAmount = 0;

    if (!filteredData) return { totalMilk, totalFat, totalAmount };

    if (Array.isArray(filteredData)) {
      filteredData.forEach(item => {
        totalMilk += Number(item.quantity) || 0;
        totalFat += Number(item.fat) || 0;
        totalAmount += Number(item.price) || 0;
      });
    } else {
      Object.values(filteredData).forEach(arr => {
        arr.forEach(item => {
          totalMilk += Number(item.quantity) || 0;
          totalFat += Number(item.fat) || 0;
          totalAmount += Number(item.price) || 0;
        });
      });
    }
    return { totalMilk, totalFat, totalAmount };
  };

  const { totalMilk, totalFat, totalAmount } = calculateTotals();

  // Generate PDF
  const buildTableRows = () => {
    let allItems = [];
    if (Array.isArray(filteredData)) allItems = filteredData;
    else Object.values(filteredData).forEach(arr => allItems.push(...arr));

    return allItems.map(item => `
      <tr>
        <td>${moment(item.date).format('DD/MM/YYYY')}</td>
        <td>${item.selectedSupplier || 'Unknown'}</td>
        <td>${item.quantity || '-'}</td>
        <td>${item.fat || '-'}</td>
        <td>${item.price || '-'}</td>
      </tr>
    `).join('');
  };

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #f4f4f4; }
          tfoot td { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Report ${supplierValue ? `for ${supplierValue}` : 'for All Suppliers'}</h1>
        <p><strong>Report Type:</strong> ${reportValue}</p>
        <p><strong>Date Range:</strong> ${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')}</p>
        <table>
          <thead>
            <tr><th>Date</th><th>Supplier</th><th>Milk (L)</th><th>Fat (%)</th><th>Price (₹)</th></tr>
          </thead>
          <tbody>${buildTableRows()}</tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total</td>
              <td>${totalMilk}</td>
              <td>${(totalFat/ deliveriesCount()).toFixed(2)} % </td>
              <td>₹${totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

  const GeneratePdf = async () => {
    const file = await printToFileAsync({ html, base64: false });
    await shareAsync(file.uri);
  };

  // Render suppliers summary (for all suppliers)
  const renderSupplierTotals = ({ item }) => {
    const [supId, deliveries] = item;
    const supplierName = supplierNames[supId] || supId || 'Unknown';

    let totalMilk = 0;
    let totalFat = 0;
    let totalAmount = 0;

    deliveries.forEach(d => {
      totalMilk += Number(d.quantity) || 0;
      totalFat += Number(d.fat) || 0;
      totalAmount += Number(d.price) || 0;
    });

    return (
      <View style={styles.supplierCard}>
        <Text style={styles.supplierName}>{supplierName}</Text>
        {reportValue === 'milk' ? (
          <Text style={styles.summaryText}>Total Milk Collected: {totalMilk}L</Text>
        ) : (
          <Text style={styles.summaryText}>
            Average Fat: {deliveries.length ? (totalFat / deliveries.length).toFixed(2) : 0}%
          </Text>
        )}
        <Text style={styles.summaryText}>Total Amount: ₹{totalAmount}</Text>
      </View>
    );
  };

  // Render delivery details (for a specific supplier)
  const renderSupplierDetails = ({ item }) => (
    <View style={styles.deliveryCard}>
      <Text style={styles.detailText}>Date: {moment(item.date).format('DD/MM/YYYY')}</Text>
      {reportValue === 'milk' ? (
        <Text style={styles.detailText}>Milk: {item.quantity || 0}L</Text>
      ) : (
        <Text style={styles.detailText}>Fat: {item.fat || 0}%</Text>
      )}
      <Text style={styles.detailText}>Amount: ₹{item.price || 0}</Text>
      {reportValue === 'milk' && (
        <Text style={styles.detailText}>Rate: ₹{item.rate || 0}/L</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding:14, paddingBottom:25, }}>
        <StatusBar hidden={true} />
      <FlatList
        data={supplierValue ? filteredData : Object.entries(filteredData)}
        keyExtractor={(item) => supplierValue ? item.id : item[0]}
        renderItem={supplierValue ? renderSupplierDetails : renderSupplierTotals}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No data available</Text>}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {reportValue === 'milk' ? 'Total Milk Collected:' : 'Average Fat:'}
          </Text>
          <Text style={styles.summaryValue}>
            {reportValue === 'milk' 
              ? `${totalMilk} L` 
              : deliveriesCount() ? `${(totalFat / deliveriesCount()).toFixed(2)} %` : `0 %`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.summaryValue}>₹{totalAmount}</Text>
        </View>
      </View>
       <TouchableOpacity style={styles.button} onPress={GeneratePdf}>
        <Text style={styles.buttonText}>Generate PDF</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  supplierCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
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
  summaryContainer: {
    padding: 16,
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22C55E',
  },
});
