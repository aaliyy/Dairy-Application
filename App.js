// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/AssetExample';
import AddSupplierScreen from './components/hello';
import SupplierScreen from './components/Suppliers';
import DailyCollectionForm from './components/collection';
import ReportScreen from './components/Report';
import AllCollection from './components/AllCollection';
import { DairyProvider } from './components/context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DairyProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddSupplier"
            component={AddSupplierScreen}
            options={{ title: 'Add Supplier' }}
          />
          <Stack.Screen
            name="Suppliers"
            component={SupplierScreen}
            options={{ title: 'Suppliers' }}
          />
          <Stack.Screen
            name="Daily Collection"
            component={DailyCollectionForm}
            options={{ title: 'Daily Collection' }}
          />
          <Stack.Screen
            name="Report"
            component={ReportScreen}
            options={{ title: 'Reports' }}
          />
          <Stack.Screen
            name="AllCollections"
            component={AllCollection}
            options={{ title: 'Collection' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DairyProvider>
  );
}
