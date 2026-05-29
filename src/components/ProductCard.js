import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors, BorderRadius } from '../theme/appTheme';

const ProductCard = ({ product, onPress, theme }) => {
  const colors = theme?.colors || Colors.light;
  const primary = theme?.primary || Colors.primary;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="contain"
          placeholder={{ color: colors.border }}
        />
      </View>
      <View style={styles.info}>
        <View style={[styles.badge, { backgroundColor: primary + '20' }]}>
          <Text
            style={[styles.badgeText, { color: primary }]}
            numberOfLines={1}
          >
            {product.category}
          </Text>
        </View>
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={2}
        >
          {product.title}
        </Text>
        <Text style={[styles.price, { color: primary }]}>
          ${product.price?.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: BorderRadius.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ProductCard;
