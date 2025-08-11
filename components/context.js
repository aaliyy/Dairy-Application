import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { db } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';

const DairyContext = createContext();

export const DairyProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  // ✅ Fetch collections from Firebase
  useEffect(() => {
    const collectionsRef = ref(db, 'collections/');

    const unsubscribe = onValue(collectionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .reverse();
        setCollections(loaded);
      } else {
        setCollections([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch suppliers from Firebase (DO NOT overwrite IDs)
  useEffect(() => {
    const suppliersRef = ref(db, 'suppliers/');

    const unsubscribe = onValue(suppliersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data)
          .map(([key, value]) => ({
            id: key, // Firebase key used as ID
            ...value,
          }))
          .reverse();
        setSuppliers(loaded);
      } else {
        setSuppliers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
 const qrId = Date.now();
  // ✅ Add a new supplier locally with sequential ID
  const addSupplier = (supplier) => {
    setSuppliers((prev) => {
      const maxId = prev.length > 0
        ? Math.max(...prev.map((s) => parseInt(s.id) || 0))
        : 0;

      const newSupplier = {
        ...supplier,
        id: (maxId + 1).toString(), // convert to string to match Firebase keys
        date: new Date().toISOString(),
      };

      return [newSupplier, ...prev];
    });
  };

  // ✅ Add a new collection locally
  const addCollection = (collection) => {
    setCollections((prev) => [collection, ...prev]);
  };

  // ✅ Delete a collection from Firebase
  const Delete = (collection) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this collection entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const itemRef = ref(db, `collections/${collection.id}`);
            remove(itemRef)
              .then(() => Alert.alert('Deleted', 'Collection entry deleted successfully'))
              .catch((error) => {
                console.error('Delete error:', error);
                Alert.alert('Error', 'Failed to delete collection');
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  // ✅ Delete a supplier from Firebase
const Delete_Suppliers = (supplier) => {
  if (!supplier || !supplier.id) {
    Alert.alert('Invalid supplier', 'Supplier id is missing.');
    console.warn('deleteSupplier called with invalid supplier:', supplier);
    return;
  }

  Alert.alert(
    'Confirm Deletion',
    `Are you sure you want to delete supplier "${supplier.name || supplier.id}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const path = `suppliers/${supplier.id}`;
            console.log('Attempting to delete:', path);

            const itemRef = ref(db, path);

            

            // Perform delete
            await remove(itemRef);

            // Immediately update local state so UI reflects deletion
            setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id));

            Alert.alert('Deleted', 'Supplier entry deleted successfully');
            console.log('Deleted supplier at', path);
          } catch (error) {
            console.error('Failed to delete supplier:', error);
            Alert.alert('Error', error.message || 'Failed to delete supplier');
          }
        },
      },
    ],
    { cancelable: false }
  );
};

  return (
    <DairyContext.Provider
      value={{
        suppliers,
        addSupplier,
        collections,
        addCollection,
        name,
        setName,
        location,
        setLocation,
        phone,
        setPhone,
        loading,
        setLoading,
        Delete,
        Delete_Suppliers,
        qrId
      }}
    >
      {children}
    </DairyContext.Provider>
  );
};

export const useDairy = () => useContext(DairyContext);
