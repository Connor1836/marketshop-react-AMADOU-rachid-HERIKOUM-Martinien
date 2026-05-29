import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrderContext';
import { useProfile } from '../context/ProfileContext';
import { getTheme, Colors, BorderRadius } from '../theme/appTheme';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const HistoryScreen = () => {
  const { profile } = useProfile();
  const theme = getTheme(profile.dark_mode);
  const { orders, loading, loadOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="receipt-outline" size={80} color={theme.colors.subtext} />
        <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
          Aucune commande pour le moment
        </Text>
      </View>
    );
  }

  const itemCount = (order) =>
    order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item: order }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.card }]}
            onPress={() => setSelectedOrder(order)}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.orderNum, { color: Colors.primary }]}>
                {order.order_number}
              </Text>
              <View style={styles.confirmedBadge}>
                <Text style={styles.confirmedText}>Confirmée</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={14} color={theme.colors.subtext} />
              <Text style={[styles.meta, { color: theme.colors.subtext }]}>
                {' '}{formatDate(order.date)}
              </Text>
            </View>
            <View style={[styles.row, { marginTop: 4 }]}>
              <Ionicons name="cube-outline" size={14} color={theme.colors.subtext} />
              <Text style={[styles.meta, { color: theme.colors.subtext }]}>
                {' '}{itemCount(order)} article(s)
              </Text>
              <Text style={[styles.amount, { color: Colors.primary }]}>
                ${order.total.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.row, { marginTop: 4 }]}>
              <Ionicons name="person-outline" size={14} color={theme.colors.subtext} />
              <Text style={[styles.meta, { color: theme.colors.subtext }]}>
                {' '}{order.full_name}
              </Text>
              <Text style={[styles.viewDetail, { color: theme.colors.subtext }]}>
                Voir détail →
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal détail commande */}
      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.handle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {selectedOrder?.order_number}
              </Text>
              <Text style={[styles.modalTotal, { color: Colors.primary }]}>
                ${selectedOrder?.total.toFixed(2)}
              </Text>
            </View>
            <Text style={[styles.modalDate, { color: theme.colors.subtext }]}>
              {selectedOrder && formatDate(selectedOrder.date)}
            </Text>
            <View style={[styles.divider, { borderColor: theme.colors.border }]} />
            <ScrollView>
              {selectedOrder?.items.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text
                    style={[styles.itemTitle, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.itemQty, { color: theme.colors.subtext }]}>
                    x{item.quantity}
                  </Text>
                  <Text style={[styles.itemSubtotal, { color: theme.colors.text }]}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: Colors.primary }]}
              onPress={() => setSelectedOrder(null)}
            >
              <Text style={styles.closeBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 18, marginTop: 16 },
  card: {
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNum: { fontSize: 15, fontWeight: 'bold' },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  confirmedText: { color: '#059669', fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center' },
  meta: { fontSize: 13 },
  amount: { marginLeft: 'auto', fontSize: 17, fontWeight: 'bold' },
  viewDetail: { marginLeft: 'auto', fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalTotal: { fontSize: 18, fontWeight: 'bold' },
  modalDate: { fontSize: 13, marginBottom: 12 },
  divider: { borderTopWidth: 1, marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemTitle: { flex: 1, fontSize: 13 },
  itemQty: { fontSize: 13, marginHorizontal: 10 },
  itemSubtotal: { fontWeight: 'bold', fontSize: 13 },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default HistoryScreen;
