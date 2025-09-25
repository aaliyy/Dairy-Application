import { StyleSheet, FlatList, View, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { useDairy } from '../../components/context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CollectionItem from '../../components/CollectionItem';
import OpenCollection from './OpenCollection';

export default function AllCollection() {
  const { collections, setSelectedCollection } = useDairy();
  const navigation = useNavigation();

  const handleCollectionPress = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      <FlatList
        data={collections}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCollectionPress(item)}>
            <CollectionItem item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 0 }}
      />
      
      <OpenCollection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  }
});
