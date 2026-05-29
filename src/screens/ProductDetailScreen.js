import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../data/api/apiService';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { getTheme, Colors, BorderRadius } from '../theme/appTheme';

const StarRating = ({ rating }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.round(rating) ? 'star' : 'star-outline'}
          size={18}
          color="#FBBF24"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
};

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { profile } = useProfile();
  const theme = getTheme(profile.dark_mode);
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await ApiService.getProductById(productId);
        setProduct(data);
      } catch (e) {
        setError('Impossible de charger ce produit.');
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addItem(product, quantity);
    setAdding(false);
    Alert.alert(
      '✅ Ajouté au panier',
      `${product.title.substring(0, 40)}... x${quantity}`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.subtext} />
        <Text style={{ color: theme.colors.text, marginVertical: 12 }}>{error}</Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.imgContainer, { backgroundColor: '#FAFAFA' }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            contentFit="contain"
          />
        </View>
        <View style={styles.body}>
          <View style={[styles.badge, { backgroundColor: Colors.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: Colors.primary }]}>
              {product.category?.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {product.title}
          </Text>
          <View style={styles.ratingRow}>
            <StarRating rating={product.rating?.rate || 0} />
            <Text style={[styles.ratingText, { color: theme.colors.subtext }]}>
              {product.rating?.rate} ({product.rating?.count} avis)
            </Text>
          </View>
          <Text style={[styles.price, { color: Colors.primary }]}>
            ${product.price?.toFixed(2)}
          </Text>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Description
          </Text>
          <Text style={[styles.desc, { color: theme.colors.subtext }]}>
            {product.description}
          </Text>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quantité
          </Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, { borderColor: Colors.primary }]}
              onPress={() => quantity > 1 && setQuantity((q) => q - 1)}
            >
              <Ionicons name="remove" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.qtyNum, { color: theme.colors.text }]}>
              {quantity}
            </Text>
            <TouchableOpacity
              style={[styles.qtyBtn, { borderColor: Colors.primary }]}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.totalLine, { color: theme.colors.text }]}>
              Total : ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: adding ? '#aaa' : Colors.primary }]}
          onPress={handleAddToCart}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cart" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addBtnText}>Ajouter au panier</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  imgContainer: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  productImage: { width: '100%', height: '100%' },
  body: { padding: 16 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, lineHeight: 28 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ratingText: { marginLeft: 8, fontSize: 13 },
  price: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  qtyBtn: { borderWidth: 1.5, borderRadius: 8, padding: 8 },
  qtyNum: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 20 },
  totalLine: { marginLeft: 'auto', fontSize: 15, fontWeight: '600' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: BorderRadius.md },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default ProductDetailScreen;
