import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, TextInput,StatusBar } from 'react-native';
import { useDairy } from '../../components/context';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function SupplierScreen() {
  const navigation = useNavigation();
  const { suppliers, Delete_Suppliers } = useDairy();
  const [search, setSearch] = useState('');

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const filtered = useMemo(() => {
    if (!search) return suppliers;
    const s = search.toLowerCase();
    return suppliers.filter(
      (c) =>
        (c.Supplier_name || "").toLowerCase().includes(s) ||
        (c.number || "").includes(s)
    );
  }, [search, suppliers]);

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => Delete_Suppliers(item)}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity onPress={() => navigation.navigate('QR', { supplierId: item.id })}>
        <View style={styles.card}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.name}>{item.Supplier_name}</Text>
            <Text style={styles.location}>{item.location || 'N/A'}</Text>
            <Text style={styles.phone}>{item.number}</Text>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => makeCall(item.number)}
          >
            <Ionicons name="call-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
         <StatusBar hidden={true} />
       <TouchableOpacity onPress={ ()=>navigation.goBack() } style={{ marginTop: 25, marginBottom:5, }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by supplier name or phone"
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={[...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('AddSupplier')}
        style={styles.AddButton}
      >
        <View>
          <FontAwesome5 name="user-plus" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    marginTop: 10,
    paddingRight: 15,
    backgroundColor: '#F3F4F6',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 5,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  phone: {
    fontSize: 14,
    color: '#6B7280',
  },
  callButton: {
    backgroundColor: '#22C55E',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '83%',
    borderRadius: 12,
    marginVertical: 6,
  },
  AddButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 30,
    right: 20,
    backgroundColor: '#22C55E',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    height: 60,
    width: 60,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
});
