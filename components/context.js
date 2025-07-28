import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const DairyContext = createContext();

export const DairyProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading,setLoading]= useState(true);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  // ✅ Fetch collections from Firebase
  useEffect(() => {
    const collectionsRef = ref(db, 'collections/');

    const unsubscribe = onValue(collectionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.values(data).reverse();
        setCollections(loaded);
      } else {
        setCollections([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const suppliersRef = ref(db, 'suppliers/');

    const unsubscribe = onValue(suppliersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.values(data).reverse();
        setSuppliers(loaded);
      } else {
        setSuppliers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addSupplier = (supplier) => {
    const newSupplier = {
      ...supplier,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const addCollection = (collection) => {
    // Optional if you're already syncing from Firebase
    setCollections((prev) => [collection, ...prev]);
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
        setLoading,
        loading
      }}
    >
      {children}
    </DairyContext.Provider>
  );
};

export const useDairy = () => useContext(DairyContext);
