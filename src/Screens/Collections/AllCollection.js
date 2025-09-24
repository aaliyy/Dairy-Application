import { StyleSheet, FlatList, View, Text,TouchableOpacity,StatusBar } from 'react-native'
import React from 'react'
import { useDairy } from '../../components/context'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CollectionItem from '../../components/CollectionItem';

export default function AllCollection() {
  const { collections, Delete } = useDairy();
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 , backgroundColor: '#fff',paddingLeft:20,paddingRight:20,marginTop:10,}}>
         <StatusBar hidden={true} />
       <TouchableOpacity onPress={ ()=>navigation.navigate('Home') } style={{ marginTop: 20, marginBottom:10, }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={collections}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={()=>Delete(item)} style={styles.listCard}>
          <CollectionItem item={item} />  
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
 
})
