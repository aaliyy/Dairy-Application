import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking, Alert } from 'react-native'; // ✅ Add these imports
import HomeScreen from './src/Screens/User/AssetExample';
import AddSupplierScreen from './src/Screens/Suppliers/hello';
import SupplierScreen from './src/Screens/Suppliers/Suppliers';
import DailyCollectionForm from './src/Screens/Collections/collection';
import ReportScreen from './src/Screens/Report/Report';
import AllCollection from './src/Screens/Collections/AllCollection';
import SupplierDetails from './src/Screens/Suppliers/SuppliersDetails';
import Header from './src/components/header';
import scanner from './src/Screens/Collections/scanner';
import { DairyProvider } from './src/components/context';
import UserPage from './src/Screens/User/Profile'; 
import ViewReport from './src/Screens/Report/ViewReport';
import CollectionItem from './src/components/CollectionItem';
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
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false ,}}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false,  animation: Platform.OS === 'ios' ? 'ios_from_left' : 'slide_from_left',  }}
          />
          <Stack.Screen
            name="AddSupplier"
            component={AddSupplierScreen}
            options={{ title: 'Add Supplier', headerShadowVisible: false, headerShown:true }}
          />
          <Stack.Screen
            name="Suppliers"
            component={SupplierScreen}
            options={{ title: 'Suppliers', headerShadowVisible: false,  }}
          />
          <Stack.Screen
            name="Daily Collection"
            component={DailyCollectionForm}
            options={{ title: 'Daily Collection', headerShadowVisible: false, }}
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
            name="Header"
            component={Header}
            options={{ headerShadowVisible: false }}
          />
          <Stack.Screen
            name="UserPage"
            component={UserPage}
            options={{ title: 'Due', headerShadowVisible: false }}
          />
           <Stack.Screen
            name="scanner"
            component={scanner}
            options={{ title: 'scanner', headerShadowVisible: false }}
          />
           <Stack.Screen
            name="ViewReport"
            component={ViewReport}
            options={{ title: 'View Report', headerShadowVisible: false , headerShown:true }}
          />
          <Stack.Screen
          name='CollectionItem'
          component={CollectionItem} 
          options={{ title: 'Collection Item', headerShadowVisible: false , headerShown:true }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </DairyProvider>
    </GestureHandlerRootView>
  );
}