import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import CatalogueScreen from '../screens/CatalogueScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import OrderScreen from '../screens/OrderScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { getTheme, Colors } from '../theme/appTheme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack pour le catalogue (catalogue + detail produit)
const CatalogueStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CatalogueMain"
      component={CatalogueScreen}
      options={{ title: 'MarketShop', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Détail produit', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

// Stack pour le panier (panier + commande)
const CartStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CartMain"
      component={CartScreen}
      options={{ title: 'Mon Panier', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="Order"
      component={OrderScreen}
      options={{ title: 'Passer commande', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HistoryMain"
      component={HistoryScreen}
      options={{ title: 'Historique', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: 'Mon Profil', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

// Badge panier
const CartTabIcon = ({ color, size }) => {
  const { itemCount } = useCart();
  return (
    <View style={{ width: size + 10, height: size + 10, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="cart-outline" size={size} color={color} />
      {itemCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'red',
            borderRadius: 9,
            minWidth: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>{itemCount}</Text>
        </View>
      )}
    </View>
  );
};

const AppNavigator = () => {
  const { profile } = useProfile();
  const theme = getTheme(profile.dark_mode);

  return (
    <NavigationContainer
      theme={{
        dark: profile.dark_mode,
        colors: {
          primary: Colors.primary,
          background: theme.colors.background,
          card: theme.colors.tabBar,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: Colors.error,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: theme.colors.tabBar,
            borderTopColor: theme.colors.border,
            elevation: 8,
            shadowOpacity: 0.1,
          },
          tabBarLabelStyle: { fontSize: 11 },
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Catalogue: 'storefront-outline',
              Panier: 'cart-outline',
              Historique: 'receipt-outline',
              Profil: 'person-outline',
            };
            if (route.name === 'Panier') {
              return <CartTabIcon color={color} size={size} />;
            }
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Catalogue" component={CatalogueStack} />
        <Tab.Screen name="Panier" component={CartStack} />
        <Tab.Screen name="Historique" component={HistoryStack} />
        <Tab.Screen name="Profil" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
