import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { db } from '../../firebase';
import { ref, onValue, remove } from 'firebase/database';

const DairyContext = createContext();

export const DairyProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState(null);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  const qrId = Date.now();

  useEffect(() => {
    let suppliersLoaded = false;
    let collectionsLoaded = false;

    const checkIfAllLoaded = () => {
      if (suppliersLoaded && collectionsLoaded) {
        setLoading(false);
      }
    };

    // ✅ Fetch collections
    const collectionsRef = ref(db, 'collections/');
    const unsubCollections = onValue(collectionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .reverse();
        setCollections(loaded);
      } else {
        setCollections([]);
      }
      collectionsLoaded = true;
      checkIfAllLoaded();
    });

    // ✅ Fetch suppliers
    const suppliersRef = ref(db, 'suppliers/');
    const unsubSuppliers = onValue(suppliersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .reverse();
        setSuppliers(loaded);
      } else {
        setSuppliers([]);
      }
      suppliersLoaded = true;
      checkIfAllLoaded();
    });

    return () => {
      unsubCollections();
      unsubSuppliers();
    };
  }, []);

  const addSupplier = (supplier) => {
    setSuppliers((prev) => [supplier, ...prev]);
  };

  const addCollection = (collection) => {
    setCollections((prev) => [collection, ...prev]);
  };

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
    
          },
        },
      ],
      { cancelable: false }
    );
  };

  const Delete_Suppliers = (supplier) => {
    if (!supplier?.id) {
      Alert.alert('Invalid supplier', 'Supplier id is missing.');
      console.warn('deleteSupplier called with invalid supplier:', supplier);
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete this supplier ?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const path = `suppliers/${supplier.id}`;
              const itemRef = ref(db, path);
              await remove(itemRef);
              setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id));
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
        qrId,
        selectedCollection,
        setSelectedCollection,
      }}
    >
      {children}
    </DairyContext.Provider>
  );
};

export const useDairy = () => useContext(DairyContext);