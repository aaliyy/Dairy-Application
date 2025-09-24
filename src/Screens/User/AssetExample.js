import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { useDairy } from '../../components/context';
import Header from '../../components/header';
import CollectionItem from '../../components/CollectionItem';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { collections,  loading,  } = useDairy();



  const recentCollection = collections.slice(0, 2);
  if (loading) return <ActivityIndicator style={{alignSelf:'center', justifyContent:'center'}} />;

 

  return (
    <View style={styles.container}>
      {/* Header */}
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Salman Dairy</Text>
          <Text style={styles.subtitle}>Collection Center</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('UserPage')}>
        <Ionicons name="person-circle-outline" size={32} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Overview Card */}
     <Header />

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.blueButton]}
            onPress={() => navigation.navigate('Suppliers')}
          >
            <Text style={styles.darkButtonText}>Suppliers</Text>
          </TouchableOpacity>
        <TouchableOpacity
            style={[styles.actionButton, styles.yellowButton]}
            onPress={() => navigation.navigate('Daily Collection')}
          >
            <Text style={styles.buttonText}>Add Collection</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.grayButton]}
            onPress={() => navigation.navigate('Report')}
          >
            <Text style={styles.darkButtonText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.quickActionsContainer}>
        <View style={styles.statsRow}>
          <Text style={styles.sectionTitle}>Recent Collections</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllCollections')}>
            <Text style={[styles.subtitle, { color: '#3B82F6' }]}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentCollection}
          renderItem={({ item }) => (<CollectionItem item={item} />)}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.7}
         onPress={() => {
              navigation.navigate('scanner');
            }}
      >
      <MaterialIcons name="qr-code-scanner" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f7', padding: 16, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
   statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  quickActionsContainer: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center'
  },
  greenButton: { backgroundColor: '#22C55E' },
  blueButton: { backgroundColor: '#BFDBFE' },
  yellowButton: { backgroundColor: '#FACC15' },
  grayButton: { backgroundColor: '#F3F4F6' },
  buttonText: { color: '#fff', fontWeight: '600' },
  darkButtonText: { color: '#111827', fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#22C55E',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    elevation: 5
  },
  smallFab: {
    position: 'absolute',
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
 
   
});