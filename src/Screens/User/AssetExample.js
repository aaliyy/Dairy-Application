import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDairy } from '../../components/context';
import Header from '../../components/header';
import CollectionItem from '../../components/CollectionItem';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { collections, loading } = useDairy();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good Morning');
    } else if (hours < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const recentCollection = collections.slice(0, 4); // show top 4

  if (loading) {
    return (
      <ActivityIndicator
        style={{ alignSelf: 'center', justifyContent: 'center', flex: 1 }}
        size="large"
        color="#3B82F6"
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Top User Greeting */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.username}>Rajesh Kumar</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#374151"
            style={{ marginRight: 12 }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('UserPage')}>
            <Ionicons name="person-circle-outline" size={38} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overview */}
      <Header />

      {/* Recent Collections */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Recent Collections</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllCollections')}
          >
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={recentCollection}
          renderItem={({ item }) => <CollectionItem item={item} />}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ marginTop: 8 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16, paddingTop: 40 },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#111827' },
  username: { fontSize: 14, color: '#6b7280', marginTop: 2 },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  viewAll: { fontSize: 14, color: '#3B82F6', fontWeight: '500' },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
