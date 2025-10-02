import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { db } from "../../../firebase";
import { ref, push } from "firebase/database";
import { useDairy } from "../../components/context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DailyCollectionForm({ route }) {
  const { suppliers } = useDairy();
  const { supplierId } = route?.params || {};
  const navigation = useNavigation();

  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fat, setFat] = useState("");
  const [snf, setSnf] = useState("");
  const [date, setDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Settings (default false)
  const [showSNF, setShowSNF] = useState(false);
  const [showFat, setShowFat] = useState(false);

  // Morning/Evening toggle
  const [isMorning, setIsMorning] = useState(true);

  // Load toggle preferences when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        const snfSetting = await AsyncStorage.getItem("showSNF");
        const fatSetting = await AsyncStorage.getItem("showFat");
        setShowSNF(snfSetting !== null ? JSON.parse(snfSetting) : false);
        setShowFat(fatSetting !== null ? JSON.parse(fatSetting) : false);
      };
      loadSettings();
    }, [])
  );

  // Auto-select Morning/Evening based on current time
  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsMorning(currentHour < 16);
  }, []);

  // Load suppliers
  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      const items = suppliers.map((sup) => ({
        label: sup.Supplier_name,
        value: sup.id.toString(),
      }));
      setDropdownItems(items);

      if (supplierId) {
        const matchedSupplier = suppliers.find(
          (supplier) => supplier.id?.toString() === supplierId?.toString()
        );
        if (matchedSupplier) {
          setSelectedSupplier(matchedSupplier.id.toString());
        } else {
          Alert.alert(
            "⚠️ QR Code Scanned",
            `Supplier ID: ${supplierId}\nPlease select manually from the dropdown`,
            [{ text: "OK" }]
          );
        }
      }
    }
  }, [suppliers, supplierId]);

  const handleAdd = () => {
    if (!selectedSupplier || !quantity || !rate) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    if (showFat && !fat) {
      Alert.alert("Error", "Please enter Fat %");
      return;
    }
    if (showSNF && !snf) {
      Alert.alert("Error", "Please enter SNF %");
      return;
    }

    const supplier = suppliers.find(
      (s) => s.id?.toString() === selectedSupplier?.toString()
    );
    if (!supplier || !supplier.Supplier_name) {
      Alert.alert("Error", "Invalid supplier selected");
      return;
    }

    const price = parseFloat(rate) * parseFloat(quantity);

    const collectionData = {
      selectedSupplier: supplier.Supplier_name,
      supplierId: supplierId || null,
      quantity: parseFloat(quantity),
      rate: parseFloat(rate),
      price,
      date: date.toISOString(),
      source: supplierId ? "qr_code" : "manual",
      morningORevening: isMorning ? "Morning" : "Evening",
      ...(showFat && { fat: parseFloat(fat) }),
      ...(showSNF && { snf: parseFloat(snf) }),
    };

    push(ref(db, "collections/"), collectionData)
      .then(() => {
        setRate("");
        setQuantity("");
        setFat("");
        setSnf("");
        setSelectedSupplier(null);
        setDate(new Date());
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Push error:", error);
        Alert.alert("Error", "Failed to submit collection");
      });
  };

  const totalAmount = (
    parseFloat(rate || 0) * parseFloat(quantity || 0)
  ).toFixed(2);

  if (!suppliers || suppliers.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>No Suppliers Found</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar hidden={true} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Collection</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Supplier Dropdown */}
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={dropdownOpen}
            value={selectedSupplier}
            items={dropdownItems}
            setOpen={setDropdownOpen}
            setValue={setSelectedSupplier}
            setItems={setDropdownItems}
            placeholder="Select Supplier"
            searchable={true}
            searchPlaceholder="Search supplier..."
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownMenu}
            textStyle={styles.dropdownText}
            searchTextInputStyle={styles.dropdownSearch}
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Liters of Milk"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        {showFat && (
          <TextInput
            style={styles.input}
            placeholder="Fat %"
            keyboardType="numeric"
            value={fat}
            onChangeText={setFat}
          />
        )}

        {showSNF && (
          <TextInput
            style={styles.input}
            placeholder="SNF %"
            keyboardType="numeric"
            value={snf}
            onChangeText={setSnf}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Rate per Liter"
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
        />

        {/* Date Picker */}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.dateButtonText}>
            {moment(date).format("DD MMM, YYYY")}
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
          maximumDate={new Date()}
        />

        {/* Morning / Evening Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setIsMorning(true)}
            style={[styles.toggleButton, isMorning && styles.toggleActive]}
          >
            <Ionicons
              name="sunny"
              size={16}
              color={isMorning ? "#fff" : "#6B7280"}
            />
            <Text
              style={[styles.toggleText, isMorning && styles.toggleTextActive]}
            >
              Morning
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsMorning(false)}
            style={[styles.toggleButton, !isMorning && styles.toggleActive]}
          >
            <Ionicons
              name="moon"
              size={16}
              color={!isMorning ? "#fff" : "#6B7280"}
            />
            <Text
              style={[styles.toggleText, !isMorning && styles.toggleTextActive]}
            >
              Evening
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            Quantity: <Text style={styles.bold}>{quantity || "0.0"} L</Text>
          </Text>
          <Text style={styles.summaryText}>
            Rate: <Text style={styles.bold}>₹{rate || "0.00"}/L</Text>
          </Text>
          <Text style={styles.summaryText}>
            Total Amount:{" "}
            <Text style={[styles.bold, styles.amount]}>₹{totalAmount}</Text>
          </Text>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>+ Add Collection</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#6B7280", textAlign: "center" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 30,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },

  // Dropdown
  dropdownContainer: { marginBottom: 15, zIndex: 3000 },
  dropdown: {
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    minHeight: 50,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
  },
  dropdownText: { fontSize: 16, color: "#111827" },
  dropdownSearch: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },

  // Date
  dateButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateButtonText: { fontSize: 16, color: "#111827", textAlign: "center" },

  // Morning/Evening Toggle
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  toggleActive: {
    backgroundColor: "#3B82F6",
  },
  toggleText: { fontSize: 16, color: "#6B7280", fontWeight: "500", marginLeft: 4 },
  toggleTextActive: { color: "#fff", fontWeight: "700" },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#374151",
  },
  bold: { fontWeight: "700" },
  amount: { color: "#2563EB" },

  // Button
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
    width:'100%',
    alignSelf:'center',
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
