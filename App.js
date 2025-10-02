import React, { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import { TouchableOpacity, StyleSheet } from 'react-native';

// ✅ Screens
import HomeScreen from './src/Screens/User/AssetExample';
import AddSupplierScreen from './src/Screens/Suppliers/hello';
import SupplierScreen from './src/Screens/Suppliers/Suppliers';
import DailyCollectionForm from './src/Screens/Collections/collection';
import ReportScreen from './src/Screens/Report/Report';
import AllCollection from './src/Screens/Collections/AllCollection';
import SupplierDetails from './src/Screens/Suppliers/SuppliersDetails';
import Header from './src/components/header';
import ScannerScreen from './src/Screens/Collections/scanner';
import { DairyProvider } from './src/components/context';
import ViewReport from './src/Screens/Report/ViewReport';
import CollectionItem from './src/components/CollectionItem';
import LoginScreen from './src/Screens/User/Login';
import UserPage from './src/Screens/User/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Scanner') {
            return (
              <View style={styles.fab}>
                <MaterialIcons name="qr-code-scanner" size={32} color="#fff" />
              </View>
            );
          }

          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Suppliers') iconName = 'people';
          else if (route.name === 'Daily Collection') iconName = 'document-text';
          else if (route.name === 'Report') iconName = 'bar-chart';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}  />
      <Tab.Screen name="Suppliers" component={SupplierScreen} />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ 
          tabBarLabel: '',
          tabBarIconStyle: {
            marginTop: -20,
          }
        }} 
      />
      <Tab.Screen name="Daily Collection" component={DailyCollectionForm} />
      <Tab.Screen name="Report" component={ReportScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        setInitialRoute(isLoggedIn ? "MainTabs" : "Login");
      } catch (error) {
        console.error('Error checking login status:', error);
        setInitialRoute("Login");
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    // Handle initial URL when app opens
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('App opened with URL:', url);
      }
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received while app running:', url);
    });

    return () => subscription?.remove();
  }, []);

  const linking = {
    prefixes: ['dairyapp://'],
    config: {
      screens: {
        Login: 'login',
        MainTabs: {
          screens: {
            Home: 'home',
            Suppliers: 'suppliers',
            Scanner: 'scanner',
            'Daily Collection': 'daily-collection',
            Report: 'report',
          },
        },
        QR: 'qr/:supplierId',
        AllCollections: 'collections',
        AddSupplier: 'add-supplier',
        ViewReport: 'view-report',
        CollectionItem: 'collection-item',
      },
    },
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DairyProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator 
            initialRouteName={initialRoute} 
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
            />
             <Stack.Screen 
              name="UserPage" 
              component={UserPage} 
            />
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{headerShown:false}}
            />
            <Stack.Screen 
              name="AddSupplier" 
              component={AddSupplierScreen} 
              options={{ headerShown: false, title: 'Add Supplier' }} 
            />
            <Stack.Screen 
              name="AllCollections" 
              component={AllCollection} 
              options={{ headerShown: false, title: 'Collection' }} 
            />
            <Stack.Screen 
              name="QR" 
              component={SupplierDetails} 
              options={{ headerShown: true, title: 'Details' }} 
            />
            <Stack.Screen 
              name="ViewReport" 
              component={ViewReport} 
              options={{ headerShown: true, title: 'View Report' }} 
            />
            <Stack.Screen 
              name="CollectionItem" 
              component={CollectionItem} 
              options={{ headerShown: true, title: 'Collection Item' }} 
            />
          </Stack.Navigator>
          <Toast />
        </NavigationContainer>
      </DairyProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
});