import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CartLine from '../components/CartLine';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { getTheme, Colors, BorderRadius } from '../theme/appTheme';

const CartScreen = ({ navigation }) => {
  const { profile } = useProfile();
  const theme = getTheme(profile.dark_mode);
  const { items, loading, total, itemCount, loadCart, updateQuantity, removeItem, emptyCart } =
    useCart();

  useEffect(() => { loadCart(); }, []);

  const confirmDelete = (id) => {
    Alert.alert('Supprimer l\'article ?', 'Cet article sera retiré du panier.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => removeItem(id) },
    ]);
  };

  const confirmClear = () => {
    Alert.alert('Vider le panier ?', 'Tous les articles seront supprimés.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: emptyCart },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="cart-outline" size={80} color={theme.colors.subtext} />
        <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
          Votre panier est vide
        </Text>
        <TouchableOpacity
          style={[styles.shopBtn, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.navigate('Catalogue')}
        >
          <Text style={styles.shopBtnText}>Continuer les achats</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartLine
            item={item}
            theme={theme}
            onQuantityChange={(qty) => {
              if (qty <= 0) confirmDelete(item.id);
              else updateQuantity(item.id, qty);
            }}
            onDelete={() => confirmDelete(item.id)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: theme.colors.text }]}>
              {itemCount} article(s)
            </Text>
            <TouchableOpacity onPress={confirmClear}>
              <Text style={{ color: Colors.error, fontWeight: '600' }}>Vider</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.subtext }]}>
            Total
          </Text>
          <Text style={[styles.totalAmount, { color: Colors.primary }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.orderBtn, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.navigate('Order')}
        >
          <Ionicons name="card-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.orderBtnText}>Passer commande</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 18, marginTop: 16, marginBottom: 24 },
  shopBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  shopBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: { fontSize: 15, fontWeight: '600' },
  footer: { padding: 16, borderTopWidth: 1 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: { fontSize: 16 },
  totalAmount: { fontSize: 22, fontWeight: 'bold' },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  orderBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CartScreen;
