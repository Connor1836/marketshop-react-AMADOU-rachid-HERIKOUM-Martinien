import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { getTheme, Colors, BorderRadius } from '../theme/appTheme';

const ProfileScreen = () => {
  const { profile, loadProfile, saveProfile, toggleDarkMode, resetData } = useProfile();
  const { emptyCart } = useCart();
  const { clearAllOrders } = useOrders();
  const theme = getTheme(profile.dark_mode);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });

  useEffect(() => {
    loadProfile().then(() => {
      setForm({ name: profile.name, email: profile.email, phone: profile.phone });
    });
  }, []);

  useEffect(() => {
    if (!editing) {
      setForm({ name: profile.name, email: profile.email, phone: profile.phone });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await saveProfile({ ...form });
    setSaving(false);
    setEditing(false);
    Alert.alert('✅ Succès', 'Profil mis à jour avec succès.');
  };

  const handleReset = () => {
    Alert.alert(
      'Vider toutes les données ?',
      'Cela effacera votre profil, votre panier et tout votre historique. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await resetData();
            await emptyCart();
            await clearAllOrders();
            Alert.alert('✅ Données supprimées', 'Toutes vos données ont été effacées.');
          },
        },
      ]
    );
  };

  const Field = ({ label, icon, field, keyboardType }) => (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            borderColor: editing ? Colors.primary : theme.colors.border,
            backgroundColor: editing ? theme.colors.card : theme.colors.background,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={theme.colors.subtext} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          value={form[field]}
          onChangeText={(val) => setForm((f) => ({ ...f, [field]: val }))}
          editable={editing}
          keyboardType={keyboardType || 'default'}
          placeholderTextColor={theme.colors.subtext}
        />
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary + '20' }]}>
          <Ionicons name="person" size={60} color={Colors.primary} />
        </View>
        {!editing && (
          <TouchableOpacity
            style={[styles.editIconBtn, { backgroundColor: Colors.primary }]}
            onPress={() => setEditing(true)}
          >
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Informations */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Field label="Nom complet" icon="person-outline" field="name" />
        <Field label="Email" icon="mail-outline" field="email" keyboardType="email-address" />
        <Field label="Téléphone" icon="call-outline" field="phone" keyboardType="phone-pad" />
      </View>

      {/* Boutons édition */}
      {editing && (
        <View style={styles.editBtns}>
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: theme.colors.border }]}
            onPress={() => {
              setEditing(false);
              setForm({ name: profile.name, email: profile.email, phone: profile.phone });
            }}
          >
            <Text style={[styles.cancelBtnText, { color: theme.colors.text }]}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Mode sombre */}
      <View style={[styles.card, { backgroundColor: theme.colors.card, marginTop: 16 }]}>
        <View style={styles.switchRow}>
          <Ionicons
            name={profile.dark_mode ? 'moon' : 'sunny'}
            size={22}
            color={Colors.primary}
          />
          <View style={styles.switchInfo}>
            <Text style={[styles.switchTitle, { color: theme.colors.text }]}>Mode sombre</Text>
            <Text style={[styles.switchSubtitle, { color: theme.colors.subtext }]}>
              Activer le thème sombre
            </Text>
          </View>
          <Switch
            value={profile.dark_mode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#ccc', true: Colors.primary + '80' }}
            thumbColor={profile.dark_mode ? Colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Vider les données */}
      <TouchableOpacity
        style={[styles.dangerCard, { backgroundColor: theme.colors.card }]}
        onPress={handleReset}
        activeOpacity={0.85}
      >
        <Ionicons name="trash-outline" size={22} color={Colors.error} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.dangerTitle, { color: Colors.error }]}>Vider mes données</Text>
          <Text style={[styles.dangerSub, { color: theme.colors.subtext }]}>
            Supprime profil, panier et commandes
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.subtext} />
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatarWrapper: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
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
  editBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  cancelBtnText: { fontWeight: '600', fontSize: 15 },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchInfo: { flex: 1, marginLeft: 12 },
  switchTitle: { fontSize: 15, fontWeight: '600' },
  switchSubtitle: { fontSize: 12, marginTop: 2 },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginTop: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  dangerTitle: { fontSize: 15, fontWeight: '600' },
  dangerSub: { fontSize: 12, marginTop: 2 },
});

export default ProfileScreen;
