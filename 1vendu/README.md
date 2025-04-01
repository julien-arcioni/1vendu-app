# Carte des Producteurs - 1vendu

## Fonctionnalités implémentées

### Carte interactive des producteurs
- Affichage d'une carte interactive avec des marqueurs pour chaque producteur
- **Utilisation de React Native Maps sur iOS et Leaflet sur Android** (sans clé Google Maps)
- Personnalisation du style de la carte pour ressembler à la maquette
- Gestion des interactions avec les marqueurs

### Modal de détail rapide d'un producteur
- Affichage d'une fiche résumée lorsqu'on clique sur un marqueur
- Présentation des informations essentielles (nom, catégories, distance)
- Bouton pour accéder à la page détaillée du producteur

### Page détaillée du producteur
- Affichage complet des informations du producteur
- Organisation en onglets (Produits, À propos, Contact)
- Intégration d'une mini-carte de localisation
- Liens de contact direct (téléphone, email, site web, itinéraire)

## Architecture
- Utilisation de React Native et Expo
- Routing avec expo-router
- **Composant de carte hybride**:
  - React Native Maps sur iOS (ne nécessite pas de clé API)
  - Leaflet via WebView sur Android (open source, sans clé API requise)

## Configuration des cartes

### Fonctionnement du système hybride
- Un composant personnalisé `MapView` détecte automatiquement la plateforme
- Sur iOS, il utilise React Native Maps nativement
- Sur Android, il intègre Leaflet via une WebView
- L'API des composants est unifiée pour faciliter l'utilisation

### Avantages
- Aucune clé Google Maps requise
- Fonctionne sur toutes les plateformes
- Apparence cohérente entre les plateformes
- Pas de coûts d'API supplémentaires

## Points d'amélioration (repérés par les TODO)

### Carte et géolocalisation
- Intégrer l'API pour récupérer les vraies données des producteurs
- Implémenter la gestion de la géolocalisation et des permissions
- Améliorer les marqueurs et leur personnalisation
- Implémenter la mise à jour de la carte lors du déplacement

### Fonctionnalités utilisateur
- Ajouter la recherche et les filtres
- Implémenter les favoris
- Ajouter le système de notation et commentaires
- Intégrer le système de commande et panier

### UI/UX
- Améliorer le design selon les maquettes exactes
- Ajouter des animations et transitions
- Implémenter la pagination pour les listes longues
- Ajouter des indicateurs de chargement

## Guide de configuration

Pour configurer correctement l'application:

1. **iOS**: Aucune configuration spéciale requise, utilise React Native Maps nativement
2. **Android**: Utilise Leaflet via WebView, aucune clé API requise
3. Configurer le backend pour fournir les données des producteurs
4. Mettre en place la gestion des permissions de géolocalisation

## Prochaines étapes
1. Finaliser l'intégration avec le backend
2. Implémenter l'authentification et les fonctionnalités utilisateur
3. Ajouter les fonctionnalités de partage et réseaux sociaux
4. Optimiser les performances et l'expérience utilisateur 