import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDairy } from '../../components/context';

const OpenCollection = () => {
  const { selectedCollection, setSelectedCollection } = useDairy();

  const closeModal = () => {
    setSelectedCollection(null);
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
              <Text style={styles.title}>{selectedCollection.selectedSupplier}</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.label}>Quantity:</Text>
                <Text style={styles.value}>{selectedCollection.quantity}L</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.label}>Fat %:</Text>
                <Text style={styles.value}>{selectedCollection.fat}%</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.label}>Rate:</Text>
                <Text style={styles.value}>₹{selectedCollection.rate}/L</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Total Price:</Text>
                <Text style={styles.value}>₹{selectedCollection.price}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>{selectedCollection.morningORevening}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>
                  {new Date(selectedCollection.date).toLocaleDateString('en-GB')}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OpenCollection;