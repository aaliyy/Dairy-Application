import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useDairy } from "../../components/context";
import { Feather } from "@expo/vector-icons";
import { db } from "../../../firebase";
import { ref, update } from "firebase/database";

const OpenCollection = () => {
  const { selectedCollection, setSelectedCollection } = useDairy();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const closeModal = () => {
    setSelectedCollection(null);
    setIsEditing(false);
    setEditedData({});
  };

  const startEditing = () => {
    setEditedData(selectedCollection);
    setIsEditing(true);
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      if (!editedData.selectedSupplier) {
        Alert.alert("Error", "Supplier name cannot be empty");
        return;
      }
      if (!editedData.quantity || isNaN(editedData.quantity)) {
        Alert.alert("Error", "Quantity must be a number");
        return;
      }

      // Update in Firebase
      const collectionRef = ref(db, `collections/${selectedCollection.key}`); 
      // key should be stored when fetching the collection
      await update(collectionRef, {
        ...editedData,
        quantity: parseFloat(editedData.quantity),
        fat: editedData.fat ? parseFloat(editedData.fat) : null,
        snf: editedData.snf ? parseFloat(editedData.snf) : null,
        rate: editedData.rate ? parseFloat(editedData.rate) : null,
        price:
          editedData.rate && editedData.quantity
            ? parseFloat(editedData.rate) * parseFloat(editedData.quantity)
            : editedData.price,
      });

      setSelectedCollection(editedData);
      setIsEditing(false);
      Alert.alert("Success", "Collection updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update collection");
    }
  };

  return (
    <Modal
      visible={selectedCollection !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {selectedCollection && (
            <>
              {/* Header with Title & Edit */}
              <View style={styles.header}>
                {isEditing ? (
                  <TextInput
                    style={styles.titleInput}
                    value={editedData.selectedSupplier}
                    onChangeText={(t) => handleChange("selectedSupplier", t)}
                  />
                ) : (
                  <Text style={styles.title}>
                    {selectedCollection.selectedSupplier}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={isEditing ? saveChanges : startEditing}
                >
                  <Feather
                    name={isEditing ? "check" : "edit"}
                    size={22}
                    color="#007AFF"
                  />
                </TouchableOpacity>
              </View>

              {/* Details */}
              {[
                { label: "Quantity (L)", field: "quantity" },
                { label: "Fat %", field: "fat" },
                { label: "SNF %", field: "snf" },
                { label: "Rate (₹/L)", field: "rate" },
                { label: "Total Price (₹)", field: "price" },
                { label: "Time", field: "morningORevening" },
                { label: "Date", field: "date", isDate: true },
              ].map(({ label, field, isDate }) => (
                <View style={styles.detailRow} key={field}>
                  <Text style={styles.label}>{label}</Text>
                  {isEditing && field !== "date" ? (
                    <TextInput
                      style={styles.input}
                      value={String(editedData[field] ?? "")}
                      onChangeText={(t) => handleChange(field, t)}
                      keyboardType={
                        ["quantity", "fat", "snf", "rate", "price"].includes(
                          field
                        )
                          ? "numeric"
                          : "default"
                      }
                    />
                  ) : (
                    <Text style={styles.value}>
                      {isDate
                        ? new Date(selectedCollection[field]).toLocaleDateString(
                            "en-GB"
                          )
                        : selectedCollection[field] || "-"}
                    </Text>
                  )}
                </View>
              ))}

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "92%",
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    marginRight: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    fontSize: 15,
    minWidth: 80,
    textAlign: "right",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OpenCollection;
