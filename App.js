import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { ProfileProvider } from './src/context/ProfileContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ProfileProvider>
      <CartProvider>
        <OrderProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </OrderProvider>
      </CartProvider>
    </ProfileProvider>
  );
}
