import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useDairy } from './context';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function SupplierScreen() {
  const navigation = useNavigation();
  const { suppliers, Delete_Suppliers } = useDairy();

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item }) => (
     <Swipeable renderRightActions={() =>(
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>  Delete_Suppliers(item)}
          >
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}>
      <TouchableOpacity onPress={() => navigation.navigate('QR', { supplierId: item.id })}>
        <View style={styles.card}>
          <View style={{justifyContent:'center'}}>
            <Text style={styles.name}>{item.Supplier_name}</Text>
            <Text style={styles.location}>{item.location}</Text>
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
      <FlatList
        data={[...suppliers].sort((a, b) => new Date(b.date) - new Date(a.date))}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
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
    justifyContent:'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  details: {
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
});
