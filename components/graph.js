import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const screenWidth = Dimensions.get("window").width;

export default function FatLitersGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const collectionsRef = ref(db, "collections/");
    const unsubscribe = onValue(collectionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const formatted = Object.values(rawData).map(item => ({
          supplier: item.selectedSupplier || "", // ✅ Pull from collection.js
          fat: item.fat,
          liters: item.quantity
        }));
        setData(formatted);
      } else {
        setData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fat % & Liters Report</Text>

      {data.length > 0 ? (
        <>
          <LineChart
            data={{
              labels: data.map(item => item.supplier),
              datasets: [
                { data: data.map(item => item.fat), color: () => "#ff6384", strokeWidth: 2 },
                { data: data.map(item => item.liters), color: () => "#36a2eb", strokeWidth: 2 }
              ],
              legend: ["Fat %", "Liters"]
            }}
            width={screenWidth - 20}
            height={240}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#1E2923",
              backgroundGradientFrom: "#3cba54",
              backgroundGradientTo: "#0f9d58",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
            }}
            bezier
            style={styles.chart}
          />

          <Text style={styles.listHeader}>Supplier Breakdown</Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.listItem}>
                <Text style={styles.day}>{item.supplier}</Text>
                <Text style={styles.amount}>Fat: {item.fat}% | {item.liters} L</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10, paddingTop: 40 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  chart: { marginVertical: 10, borderRadius: 16, alignSelf: "center" },
  listHeader: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 5 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 5,
  },
  day: { fontSize: 16, fontWeight: "500" },
  amount: { fontSize: 16, fontWeight: "bold", color: "#0f9d58" },
});
