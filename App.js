import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking, Alert } from 'react-native'; // ✅ Add these imports
import HomeScreen from './components/AssetExample';
import AddSupplierScreen from './components/hello';
import SupplierScreen from './components/Suppliers';
import DailyCollectionForm from './components/collection';
import ReportScreen from './components/Report';
import AllCollection from './components/AllCollection';
import SupplierDetails from './components/QR';
import graph from './components/graph';
import scanner from './components/scanner';
import { DairyProvider } from './components/context';
import Dues from './components/Dues'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  // ✅ Add debugging for deep links
  useEffect(() => {
    // Debug: Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('App opened with URL:', url);
       
      }
    });

    // Debug: Listen for deep links when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received while app running:', url);
      Alert.alert('Deep Link Debug', `Received: ${url}`);
    });

    return () => subscription?.remove();
  }, []);

  const linking = {
    prefixes: ['dairyapp://'],
    config: {
      screens: {
        'Daily Collection': 'daily-collection/:supplierId',
        QR: 'qr/:supplierId',
        QRS: 'scanner',
      },
    },
  };

  return (
    <GestureHandlerRootView>
    <DairyProvider>
      <NavigationContainer 
        linking={linking}        
      >
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddSupplier"
            component={AddSupplierScreen}
            options={{ title: 'Add Supplier', headerShadowVisible: false }}
          />
          <Stack.Screen
            name="Suppliers"
            component={SupplierScreen}
            options={{ title: 'Suppliers', headerShadowVisible: false }}
          />
          <Stack.Screen
            name="Daily Collection"
            component={DailyCollectionForm}
            options={{ title: 'Daily Collection', headerShadowVisible: false }}
          />
          <Stack.Screen
            name="Report"
            component={ReportScreen}
            options={{ title: 'Reports', headerShadowVisible: false }}
          />
          <Stack.Screen
            name="AllCollections"
            component={AllCollection}
            options={{ title: 'Collection', headerShadowVisible: false }}
          />
          <Stack.Screen
            name="QR"
            component={SupplierDetails}
            options={{ title: 'Details', headerShadowVisible: false }}
          />
          <Stack.Screen
            name="graph"
            component={graph}
            options={{ title: 'Graph', headerShadowVisible: false }}
          />
          <Stack.Screen
            name="Due"
            component={Dues}
            options={{ title: 'Due', headerShadowVisible: false }}
          />
           <Stack.Screen
            name="scanner"
            component={scanner}
            options={{ title: 'scanner', headerShadowVisible: false }}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </DairyProvider>
    </GestureHandlerRootView>
  );
}