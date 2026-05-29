import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../theme/appTheme';

const CartLine = ({ item, onQuantityChange, onDelete, theme }) => {
  const colors = theme?.colors || Colors.light;
  const primary = theme?.primary || Colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="contain"
      />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.unitPrice, { color: colors.subtext }]}>
          ${item.price?.toFixed(2)} / unité
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.qtyBtn, { borderColor: primary }]}
            onPress={() => onQuantityChange(item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={primary} />
          </TouchableOpacity>
          <Text style={[styles.qty, { color: colors.text }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            style={[styles.qtyBtn, { borderColor: primary }]}
            onPress={() => onQuantityChange(item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={primary} />
          </TouchableOpacity>
          <Text style={[styles.subtotal, { color: Colors.secondary }]}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={22} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: BorderRadius.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
  },
  qty: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  subtotal: {
    marginLeft: 'auto',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 4,
  },
});

export default CartLine;
