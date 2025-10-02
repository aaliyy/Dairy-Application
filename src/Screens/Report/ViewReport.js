// ViewReportScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import moment from 'moment';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

export default function ViewReportScreen({ route , item}) {
  const { startDate, endDate,  supplierValue, timeFilterValue,isToday } = route.params;
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
        Object.keys(data).forEach((key) => {
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
        let all = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        const filtered = all.filter((item) => {
          const itemDate = moment(item.date, ['DD/MM/YYYY', 'DD MMMM, YYYY', moment.ISO_8601]);
          const inRange =
            itemDate.isValid() &&
            itemDate.isBetween(
              moment(startDate).startOf('day'),
              moment(endDate).endOf('day'),
              null,
              '[]'
            );
          if (!inRange) return false;

          if (supplierValue && supplierValue !== 'All Suppliers' && item.selectedSupplier !== supplierValue) return false;

          if (timeFilterValue) {
  const itemTime = item.morningORevening?.toLowerCase() || '';
  if (timeFilterValue === 'morning' && itemTime !== 'morning') return false;
  if (timeFilterValue === 'evening' && itemTime !== 'evening') return false;
}
// if timeFilterValue is null => show all entries


          return true;
        });

        if (!supplierValue || supplierValue === 'All Suppliers') {
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

  const deliveriesCount = () => {
    if (Array.isArray(filteredData)) return filteredData.length;
    return Object.values(filteredData).reduce((sum, arr) => sum + arr.length, 0);
  };

  const calculateTotals = () => {
    let totalMilk = 0,
      totalFat = 0,
      totalAmount = 0,
      totalSNF = 0;
    if (!filteredData) return { totalMilk, totalFat, totalAmount, totalSNF };

    if (Array.isArray(filteredData)) {
      filteredData.forEach((item) => {
        totalMilk += Number(item.quantity) || 0;
        totalFat += Number(item.fat) || 0;
        totalSNF += Number(item.snf) || 0;
        totalAmount += Number(item.price) || 0;
      });
    } else {
      Object.values(filteredData).forEach((arr) => {
        arr.forEach((item) => {
          totalMilk += Number(item.quantity) || 0;
          totalFat += Number(item.fat) || 0;
          totalSNF += Number(item.snf) || 0;
          totalAmount += Number(item.price) || 0;
        });
      });
    }
    return { totalMilk, totalFat, totalAmount, totalSNF };
  };

  const { totalMilk, totalFat, totalAmount, totalSNF } = calculateTotals();

  // Generate PDF
 const buildTableRows = () => {
  let allItems = [];
  if (Array.isArray(filteredData)) allItems = filteredData;
  else Object.values(filteredData).forEach(arr => allItems.push(...arr));

  return allItems.map(item => `
    <tr>
      <td>${moment(item.date).format('DD/MM/YYYY')}</td>
      <td>${item.morningORevening || '-'}</td>
      <td>${item.selectedSupplier || 'Unknown'}</td>
      <td>${item.quantity || '-'}</td> 
      <td>${item.fat || '-'}</td>
      <td>${item.snf || '-'}</td>
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
      <h1>Report ${supplierValue && supplierValue !== 'All Suppliers' ? `for ${supplierValue}` : 'for All Suppliers'}</h1>
      <p><strong>Time:</strong> ${timeFilterValue === 'morning' ? 'Morning' : 'Evening'}</p>
      <p><strong>Date Range:</strong> ${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Supplier</th>
            <th>Milk (L)</th>
            <th>Fat (%)</th>
            <th>SNF</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>${buildTableRows()}</tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total</td>
            <td>${totalMilk}</td>
            <td>${(totalFat / deliveriesCount()).toFixed(2)} %</td>
            <td>${(totalSNF / deliveriesCount()).toFixed(2)}</td>
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

 if (timeFilterValue && timeFilterValue !== "all") {
  const itemTime = item.morningORevening?.toLowerCase() || '';
  if (timeFilterValue === 'morning' && itemTime !== 'morning') return false;
  if (timeFilterValue === 'evening' && itemTime !== 'evening') return false;
}


  // Render Daily Records
  const renderDailyRecord = ({ item }) => {
  const supplierName =
    supplierNames[item.selectedSupplier] ||
    item.selectedSupplier ||
    "Unknown";

  return (
    <View style={styles.dailyRow}>
      {/* Supplier Name */}
      <Text style={styles.dailySupplier}>{supplierName}</Text>

      {/* Date */}
      <Text style={styles.dailyDate}>
        {moment(item.date).format("DD MMM")}
      </Text>

      {/* Quantity */}
      <Text style={styles.dailyValue}>{item.quantity || 0} L</Text>

      {/* Fat */}
      <Text style={styles.dailyQuality}>{item.fat || "-"}</Text>

      {/* SNF */}
      <Text style={styles.dailyQuality}>{item.snf || "-"}</Text>

      {/* Amount */}
      <Text style={styles.dailyAmount}>₹{item.price || 0}</Text>
    </View>
  );
};


  // Collect flat list data
  const flatData = Array.isArray(filteredData)
    ? filteredData
    : Object.values(filteredData).flat();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View contentContainerStyle={{ padding: 16 }}>
        {/* Header Period */}
        <View style={styles.periodCard}>
          <Text style={styles.periodText}>
  {isToday
    ? moment(startDate).format('DD MMMM YYYY')
    : `${moment(startDate).format('DD MMMM YYYY')} - ${moment(endDate).format('DD MMMM YYYY')}`}
</Text>

        </View>
        <View style={styles.supplierCard}>
  <Text style={styles.supplierText}>
    Supplier: {supplierValue || 'All Suppliers'}
  </Text>
</View>

        {/* Cards */}
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Collection</Text>
            <Text style={styles.cardValue}>{totalMilk} L</Text>
            <Text style={styles.cardSub}> {(totalMilk / ((moment(endDate).diff(moment(startDate), 'days') + 1) || 1)).toFixed(1)} L daily Avg</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Earnings</Text>
            <Text style={styles.cardValue}>₹{totalAmount}</Text>
            <Text style={styles.cardSub}></Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Avg Fat</Text>
            <Text style={styles.cardValue}>
              {(totalFat / (deliveriesCount() || 1)).toFixed(1)}
            </Text>
            <Text style={styles.cardSub}></Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Avg SNF</Text>
            <Text style={styles.cardValue}>
                {(totalSNF / (deliveriesCount() || 1)).toFixed(1)}
            </Text>
            <Text style={styles.cardSub}></Text>
          </View>
        </View>

        {/* Daily Records */}
        <Text style={styles.sectionTitle}>Daily Records</Text>
        <FlatList
          data={flatData}
          keyExtractor={(item) => item.id}
          renderItem={renderDailyRecord}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No data available
            </Text>
          }
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pdfBtn} onPress={GeneratePdf}>
            <Text style={styles.buttonText}>Generate PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  periodCard: {
    backgroundColor: '#E0EDFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  periodText: { fontSize: 16, fontWeight: 'bold', color: '#2563EB' },

  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    margin: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: '#555' },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: '#22C55E', marginVertical: 4 },
  cardSub: { fontSize: 12, color: '#888' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },

  dailyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dailyDate: { fontWeight: 'bold', color: '#333' },
  dailyValue: { color: '#22C55E', fontWeight: '600' },
  dailyQuality: { color: '#555' },
  dailyAmount: { fontWeight: 'bold', color: '#333' },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  shareBtn: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 14,
    borderRadius: 10,
    marginRight: 6,
    alignItems: 'center',
  },
  pdfBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    marginLeft: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  shareBtnText: { color: '#333', fontWeight: 'bold' },
  supplierCard: {
  backgroundColor: '#F0FDF4',
  padding: 12,
  borderRadius: 10,
  marginBottom: 12,
  alignItems: 'center',
},
supplierText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#16A34A',
},


});
