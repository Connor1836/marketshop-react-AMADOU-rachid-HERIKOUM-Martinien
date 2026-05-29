import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useProfile } from '../context/ProfileContext';
import { getTheme, Colors, BorderRadius } from '../theme/appTheme';

const OrderScreen = ({ navigation }) => {
  const { profile } = useProfile();
  const theme = getTheme(profile.dark_mode);
  const { items, total, emptyCart } = useCart();
  const { placeOrder } = useOrders();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Nom requis';
    if (!form.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    } else if (!/^[0-9+\s\-]{7,15}$/.test(form.phone.trim())) {
      newErrors.phone = 'Numéro invalide (chiffres uniquement)';
    }
    if (!form.address.trim()) newErrors.address = 'Adresse requise';
    if (!form.city.trim()) newErrors.city = 'Ville requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderNumber = await placeOrder({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        cartItems: items,
        total,
      });
      await emptyCart();
      Alert.alert('✅ Commande confirmée !', `Numéro: ${orderNumber}`, [
        { text: 'Voir historique', onPress: () => navigation.navigate('History') },
      ]);
    } catch (e) {
      Alert.alert('Erreur', 'Une erreur est survenue. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, icon, field, keyboardType, multiline }) => (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            borderColor: errors[field] ? Colors.error : theme.colors.border,
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={theme.colors.subtext}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          value={form[field]}
          onChangeText={(val) => setForm((f) => ({ ...f, [field]: val }))}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          placeholderTextColor={theme.colors.subtext}
          placeholder={label}
        />
      </View>
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ padding: 16 }}
      >
        <Text style={[styles.sectionTitle, { color: Colors.primary }]}>
          Informations de livraison
        </Text>

        <Field label="Nom complet" icon="person-outline" field="fullName" />
        <Field label="Téléphone" icon="call-outline" field="phone" keyboardType="phone-pad" />
        <Field label="Adresse" icon="location-outline" field="address" multiline />
        <Field label="Ville" icon="business-outline" field="city" />

        <Text style={[styles.sectionTitle, { color: Colors.primary, marginTop: 24 }]}>
          Récapitulatif
        </Text>

        {items.map((item) => (
          <View key={item.id} style={styles.recapLine}>
            <Text
              style={[styles.recapTitle, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={[styles.recapQty, { color: theme.colors.subtext }]}>
              x{item.quantity}
            </Text>
            <Text style={[styles.recapSubtotal, { color: theme.colors.text }]}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={[styles.divider, { borderColor: theme.colors.border }]} />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
          <Text style={[styles.totalAmount, { color: Colors.primary }]}>
            ${total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmBtn,
            { backgroundColor: submitting ? '#aaa' : Colors.primary },
          ]}
          onPress={handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.confirmBtnText}>Confirmer la commande</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  fieldWrapper: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 15 },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4 },
  recapLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  recapTitle: { flex: 1, fontSize: 13 },
  recapQty: { fontSize: 13, marginHorizontal: 8 },
  recapSubtotal: { fontSize: 13, fontWeight: '600' },
  divider: { borderTopWidth: 1, marginVertical: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalAmount: { fontSize: 20, fontWeight: 'bold' },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginBottom: 32,
  },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default OrderScreen;
