# MarketShop — React Native (Expo)

> Mini application e-commerce mobile développée avec **React Native / Expo**

---

## 👤 Auteur
**Nom Prénom** — AMADOU-rachid-et-HERIKOUM-Martinien

---

## 📱 Description
MarketShop est une application mobile de mini e-commerce permettant de parcourir un catalogue de produits (via FakeStoreAPI), d'ajouter des articles au panier, de passer des commandes et de consulter l'historique des achats. Toutes les données locales (panier, commandes, profil) sont persistées avec SQLite via `expo-sqlite`. L'état global est géré avec React Context API.

---

## ✅ Fonctionnalités implémentées

### Écran Catalogue
- [x] Affichage de la liste des produits en grille (2 colonnes)
- [x] Image, titre, prix, catégorie sur chaque carte
- [x] Filtrage par catégorie (chips horizontaux)
- [x] Indicateur de chargement (ActivityIndicator)
- [x] Pull-to-refresh
- [x] Message d'erreur clair + bouton réessayer
- [x] Navigation vers le détail produit

### Écran Détail Produit
- [x] Image grande, titre, prix, description, catégorie, note (étoiles)
- [x] Sélecteur de quantité (+ et −)
- [x] Bouton "Ajouter au panier" avec sauvegarde locale
- [x] Confirmation visuelle (Alert)

### Écran Panier
- [x] Liste des articles avec image, titre, prix unitaire, quantité, sous-total
- [x] Modification de la quantité
- [x] Suppression d'un article (avec confirmation)
- [x] Total général
- [x] Bouton "Passer commande"
- [x] Message "Votre panier est vide"
- [x] Badge dynamique sur l'onglet panier

### Écran Commande
- [x] Formulaire : nom, téléphone, adresse, ville
- [x] Validation des champs (tous requis, téléphone numérique)
- [x] Récapitulatif du panier en lecture seule
- [x] Confirmation → sauvegarde commande, vide panier, redirige historique

### Écran Historique
- [x] Liste des commandes de la plus récente à la plus ancienne
- [x] Numéro, date, nombre d'articles, montant total
- [x] Détail complet en Modal (liste des produits commandés)
- [x] Message "Aucune commande pour le moment"

### Écran Profil
- [x] Affichage des informations (nom, email, téléphone)
- [x] Modification du profil
- [x] Switch mode sombre / clair
- [x] Bouton "Vider mes données" avec confirmation

---

## 📦 Bibliothèques utilisées

| Bibliothèque | Version | Usage |
|---|---|---|
| `expo` | ~51.0.0 | Plateforme de développement |
| `react-native` | 0.74.1 | Framework UI |
| `@react-navigation/native` | ^6.1.17 | Navigation |
| `@react-navigation/bottom-tabs` | ^6.5.20 | Navigation par onglets |
| `@react-navigation/native-stack` | ^6.9.26 | Navigation stack |
| `expo-sqlite` | ~14.0.3 | Persistance locale SQLite |
| `expo-image` | ~1.12.12 | Chargement images avec cache |
| `@expo/vector-icons` | ^14.0.2 | Icônes Ionicons |
| `react-native-gesture-handler` | ~2.16.1 | Gestes tactiles |

---

## 🚀 Lancer le projet

```bash
# Installer les dépendances
npm install

# Lancer avec Expo Go
npx expo start

# Lancer sur Android
npx expo start --android

# Build APK standalone
npx expo build:android
# ou avec EAS
eas build --platform android
```

---

## 🖼️ Captures d'écran
*(À ajouter après les tests : catalogue, panier, historique)*

---

## ⚠️ Difficultés rencontrées
La principale difficulté a été la migration vers l'API asynchrone d'`expo-sqlite` v14 qui a introduit `openDatabaseAsync` en remplacement de l'API synchrone. La gestion du mode sombre en temps réel via le Context API a également demandé d'encapsuler le `NavigationContainer` dans un Consumer du `ProfileContext` pour que les thèmes se mettent à jour dynamiquement sans redémarrage. La synchronisation du badge du panier sur la Bottom Tab Bar a été résolue en accédant directement au CartContext depuis le composant d'icône.

---

## 🔮 Améliorations possibles
Avec plus de temps, il serait intéressant d'implémenter une recherche textuelle en temps réel dans le catalogue, des animations fluides avec `react-native-reanimated`, un système d'authentification avec JWT, des notifications push via `expo-notifications` pour le suivi des commandes, et la possibilité de partager une commande. Une migration vers TypeScript améliorerait aussi la robustesse du code.

---

## 🔗 Lien vers la version Flutter
👉 [marketshop-flutter] https://github.com/Connor1836/marketshop-flutter-AMADOU-rachid-HERIKOUM-Martinien