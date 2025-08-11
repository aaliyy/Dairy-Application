import { StyleSheet, FlatList, View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { useDairy } from './context'

export default function AllCollection() {
  const { collections, Delete } = useDairy();

  return (
    <View style={{ flex: 1 , backgroundColor: '#F3F4F6',paddingLeft:20,paddingRight:20}}>
      <FlatList
        data={collections}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={()=>Delete(item)} style={styles.listCard}>
            <Text style={styles.listName}>{item.selectedSupplier}</Text>
            <Text style={styles.subtitle}>{item.quantity} L</Text>
            <Text>{new Date(item.date).toLocaleDateString('en-GB')}</Text>
            <Text style={styles.amount}>₹{item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginTop:5,
    marginBottom: 8,
  },
  listName: { fontWeight: '600', fontSize: 14, color: '#111827' },
  amount: { fontWeight: 'bold', color: '#16A34A', textAlign: 'right', marginTop: 4 },
  subtitle: { fontSize: 12, color: '#6B7280' },
})
