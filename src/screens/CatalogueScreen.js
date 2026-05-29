import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../data/api/apiService';
import ProductCard from '../components/ProductCard';
import { useProfile } from '../context/ProfileContext';
import { getTheme, Colors } from '../theme/appTheme';

const CatalogueScreen = ({ navigation }) => {
  const { profile } = useProfile();
  const theme = getTheme(profile.dark_mode);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Tous']);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setError('');
    try {
      const [prods, cats] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getCategories(),
      ]);
      setProducts(prods);
      setFiltered(prods);
      setCategories(['Tous', ...cats]);
    } catch (e) {
      setError('Impossible de charger les produits. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filterByCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'Tous') {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === cat));
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.subtext }]}>
          Chargement des produits...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="wifi-outline" size={64} color={theme.colors.subtext} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: Colors.primary }]}
          onPress={loadData}
        >
          <Text style={styles.retryBtnText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Filtre catégories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedCategory === cat
                    ? Colors.primary
                    : theme.colors.card,
                borderColor:
                  selectedCategory === cat ? Colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => filterByCategory(cat)}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color:
                    selectedCategory === cat ? '#fff' : theme.colors.text,
                  fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grille */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            theme={theme}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: theme.colors.subtext }}>
              Aucun produit dans cette catégorie.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 15 },
  errorText: { fontSize: 16, textAlign: 'center', marginVertical: 16 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  filterBar: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: { fontSize: 13 },
  grid: { padding: 6 },
});

export default CatalogueScreen;
