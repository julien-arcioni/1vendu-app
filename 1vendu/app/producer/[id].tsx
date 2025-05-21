import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Linking, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Imports spécifiques à iOS
import RNMapView, { Marker } from 'react-native-maps';

// TODO: Intégrer l'API pour récupérer les données détaillées du producteur
// TODO: Implémenter un système de commentaires et notations
// TODO: Ajouter des fonctionnalités de partage sur les réseaux sociaux
// TODO: Intégrer un système de commande et de panier

// Type pour un produit venant de l'API
type ApiProduct = {
  id: number;
  attributes: {
    title: string;
    price: number; // Sera un nombre depuis l'API
    gallery?: { // gallery est optionnelle et peut ne pas avoir de données
      data: {
        id: number;
        attributes: {
          url: string;
        };
      }[];
    };
    // Ajoutez d'autres champs de produit si nécessaire
  };
};

// Type pour le producteur venant de l'API (utilisateur avec profil vendeur)
type ApiProducerData = {
  id: number;
  username: string; 
  email: string; 
  description?: string;
  phone?: string;
  seller?: { 
    id: number;
    companyName?: string; 
    description?: string; // Description courte spécifique au vendeur (différente de la bio)
    bio?: string; // Bio spécifique au profil vendeur (si vous voulez la garder distincte)
    sellerPhoto?: { 
      data?: {
        id: number;
        attributes: {
          url: string;
        };
      }[] | { id: number; attributes: { url: string; }; }; 
    };
    addressPickUp?: { 
      id: number;
      address1?: string;
      address2?: string;
      address3?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
    products?: {
      data: ApiProduct[]; // Ceci est si Strapi retourne { data: [...] } pour la relation
    } | ApiProduct[]; // Ou directement un tableau de produits, comme vu dans le log
    phone?: string; // Téléphone spécifique au profil vendeur
    website?: string;
    openingHours?: string; 
    categories?: string[] | { name: string }[]; 
  };
};

// Type utilisé par le composant, après transformation
type Product = {
  id: number;
  name: string;
  price: string; // Formaté pour affichage
  image: string | number; // URL ou require()
};

type Producer = {
  id: number;
  name: string;
  description: string; // Description courte du vendeur
  latitude: number;
  longitude: number;
  categories: string[]; // Catégories de produits que le vendeur propose
  distance: number; 
  image: string | number; // Photo de profil du vendeur (ronde)
  coverImage: string | number; // Image de couverture (grande image de fond) - Placeholder pour l'instant
  bio: string; // Bio détaillée (À propos)
  products: Product[];
  address: string; 
  phone: string;
  email: string;
  hours: string;
  website: string;
};

// Le type pour le paramètre addr doit correspondre au type de seller.addressPickUp
const formatAddress = (addr: NonNullable<ApiProducerData['seller']>['addressPickUp']) => {
  if (!addr) return 'Adresse non disponible';
  const parts = [addr.address1, addr.address2, addr.address3].filter(Boolean).join(', ');
  const cityPostalCode = [addr.postalCode, addr.city].filter(Boolean).join(' ');
  return [parts, cityPostalCode].filter(Boolean).join(', ') || 'Adresse non disponible';
};

export default function ProducerDetailScreen() {
  const { id } = useLocalSearchParams();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const producerId = typeof id === 'string' ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : 0;
    
    if (producerId) {
      const fetchProducerDetails = async () => {
        try {
          const populateQuery = [
            'populate[seller][populate][addressPickUp]=*',
            'populate[seller][populate][sellerPhoto]=*', // Pour l'image de profil ronde
            'populate[seller][populate][products][populate][gallery]=*',
            // TODO: Ajouter une population pour une image de couverture si elle existe sur User ou Seller
            // 'populate[userPhoto]=*' // Si l'image de profil vient directement de l'user
          ].join('&');
          
          const response = await fetch(`http://localhost:1337/api/users/${producerId}?${populateQuery}`);
          
          if (!response.ok) {
            console.error('Erreur HTTP:', response.status);
            const errText = await response.text();
            console.error("Texte de l'erreur API:", errText);
            setProducer(null);
            return;
          }
          const data: ApiProducerData = await response.json();

          if (data) { // data est l'objet User
            const sellerProfile = data.seller;
            console.log("User data:", JSON.stringify(data, null, 2));
            console.log("Seller Profile:", JSON.stringify(sellerProfile, null, 2));

            const addressData = sellerProfile?.addressPickUp;
            
            let profileImage: string | number = require('@/assets/images/icon.png'); // Placeholder pour l'image de profil ronde
            // Priorité à sellerPhoto, puis userPhoto si défini dans le schéma User et peuplé
            const sellerPhotoField = sellerProfile?.sellerPhoto;
            if (sellerPhotoField?.data) {
              const photoData = Array.isArray(sellerPhotoField.data) ? sellerPhotoField.data[0] : sellerPhotoField.data;
              if (photoData?.attributes?.url) {
                profileImage = `http://localhost:1337${photoData.attributes.url}`;
              }
            } else if ((data as any).userPhoto?.data?.attributes?.url) { // Supposant que userPhoto est sur data
                 profileImage = `http://localhost:1337${(data as any).userPhoto.data.attributes.url}`;
            }
            
            // Placeholder pour l'image de couverture
            const coverImagePlaceholder: string | number = require('@/assets/images/splash-icon.png');

            let productsSource = sellerProfile?.products;
            if (productsSource && (productsSource as any).data) {
                productsSource = (productsSource as any).data;
            }

            const formattedProducts: Product[] = Array.isArray(productsSource) ? productsSource.map((p: any) => {
                let productImage: string | number = require('@/assets/images/icon.png');
                if (p.gallery && Array.isArray(p.gallery) && p.gallery.length > 0 && p.gallery[0]?.url) {
                    productImage = `http://localhost:1337${p.gallery[0].url}`;
                }
                return {
                    id: p.id,
                    name: p.title || "Nom de produit inconnu",
                    price: p.price ? `${Number(p.price).toFixed(2).replace('.', ',')} €/kg` : 'Prix non spécifié', 
                    image: productImage,
                };
            }) : [];
            
            let categoriesFormatted: string[] = [];
            if (sellerProfile?.categories) {
              if (typeof sellerProfile.categories[0] === 'string') {
                categoriesFormatted = sellerProfile.categories as string[];
              } else if (Array.isArray(sellerProfile.categories) && sellerProfile.categories.length > 0 && typeof sellerProfile.categories[0] === 'object' && sellerProfile.categories[0] !== null && 'name' in sellerProfile.categories[0]) {
                categoriesFormatted = (sellerProfile.categories as { name: string }[]).map(c => c.name);
              }
            } else {
              // Catégories par défaut si non fournies par l'API, basées sur l'image
              categoriesFormatted = ["Fruits", "Légumes", "Oeufs"];
            }


            setProducer({
              id: data.id,
              name: sellerProfile?.companyName || data.username || 'Nom du Producteur',
              description: sellerProfile?.description || '', // Description courte du vendeur
              latitude: addressData?.latitude || 0,
              longitude: addressData?.longitude || 0,
              categories: categoriesFormatted, 
              distance: 2.7, // Placeholder
              image: profileImage,
              coverImage: coverImagePlaceholder, // Utiliser le placeholder
              bio: data.description || sellerProfile?.bio || "Je suis un agriculteur passionné...", // Bio détaillée
              products: formattedProducts,
              address: formatAddress(addressData),
              phone: data.phone || sellerProfile?.phone || '01 02 03 04 05',
              email: data.email || 'contact@la-ferme-locale.org',
              hours: sellerProfile?.openingHours || 'Non renseigné', // Placeholder pour les heures
              website: sellerProfile?.website || 'Non renseigné', // Placeholder pour le site
            });
          } else {
            console.error('Données utilisateur non trouvées ou profil vendeur manquant.');
            setProducer(null);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des détails du producteur:", error);
          setProducer(null);
        }
      };
      fetchProducerDetails();
    }
  }, [id]);

  if (!producer) {
    return <View style={styles.loadingContainer}><Text>Chargement...</Text></View>;
  }

  // Filtrer les produits basé sur la recherche et la catégorie sélectionnée
  const filteredProducts = producer.products.filter(product => {
    const matchesSearchQuery = product.name.toLowerCase().includes(productSearchQuery.toLowerCase());
    const matchesCategory = selectedProductCategory ? producer.categories.includes(selectedProductCategory) /* Correction ici, vérifier si la catégorie DU PRODUIT correspond */ : true; // Doit être basé sur product.category
    return matchesSearchQuery && matchesCategory;
  });


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image source={producer.coverImage as any} style={styles.coverImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareIcon}>
          <FontAwesome name="share-alt" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileImageContainer}>
          <Image source={producer.image as any} style={styles.profileImage} />
        </View>
      </View>

      {/* Producer Info Section */}
      <View style={styles.producerInfoContainer}>
        <Text style={styles.producerNameText}>{producer.name}</Text>
        <View style={styles.contactIconsContainer}>
            <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="facebook-square" size={28} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="heart-o" size={28} color="#e4405f" />
            </TouchableOpacity>
        </View>
        
        <View style={styles.contactDetailItem}>
          <FontAwesome name="map-marker" size={18} color="#666" style={styles.contactIcon} />
          <Text style={styles.contactText}>{producer.address} (à {producer.distance} km)</Text>
        </View>
        <View style={styles.contactDetailItem}>
          <FontAwesome name="phone" size={18} color="#666" style={styles.contactIcon} />
          <Text style={styles.contactText}>{producer.phone}</Text>
        </View>
        <View style={styles.contactDetailItem}>
          <FontAwesome name="envelope" size={18} color="#666" style={styles.contactIcon} />
          <Text style={styles.contactText}>{producer.email}</Text>
        </View>
        
        <Text style={styles.bioText}>{producer.bio}</Text>
      </View>

      {/* Products Section */}
      <View style={styles.productsSectionContainer}>
        <Text style={styles.sectionTitle}>Nos produits</Text>
        <View style={styles.productSearchContainer}>
          <FontAwesome name="search" size={18} color="#aaa" style={styles.searchIcon} />
          <TextInput
            style={styles.productSearchInput}
            placeholder="ex: pommes, carottes..."
            value={productSearchQuery}
            onChangeText={setProductSearchQuery}
            placeholderTextColor="#aaa"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {/* Utiliser les catégories du producteur ou des catégories statiques */}
          {producer.categories.map(category => (
            <TouchableOpacity 
              key={category} 
              style={[styles.categoryChip, selectedProductCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedProductCategory(selectedProductCategory === category ? null : category)}
            >
              <Text style={[styles.categoryChipText, selectedProductCategory === category && styles.categoryChipTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredProducts.map(product => (
          <View key={product.id} style={styles.productCard}>
            <Image source={product.image as any} style={styles.productItemImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productItemName}>{product.name}</Text>
              <Text style={styles.productItemPrice}>{product.price}</Text>
              {/* TODO: Ajouter le tag de catégorie du produit ici si disponible */}
            </View>
            <View style={styles.productActions}>
              <View style={styles.quantitySelector}>
                <Text>0 g</Text>
                <FontAwesome name="chevron-down" size={16} color="#888" />
              </View>
              <TouchableOpacity style={styles.addToCartButtonProd}>
                <Text style={styles.addToCartButtonTextProd}>Ajouter au panier</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {filteredProducts.length === 0 && <Text style={styles.noProductsText}>Aucun produit ne correspond à votre recherche.</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header
  headerContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 200, // Ajuster selon le design
    resizeMode: 'cover',
  },
  backButton: { // Ajusté pour être sur l'image de couverture
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20, // Marge pour la barre de statut
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  shareIcon: { // Ajusté pour être sur l'image de couverture
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50, // Pour superposer sur la section info
    left: '50%',
    marginLeft: -50, // Moitié de la largeur de l'image
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

  },
  profileImage: {
    width: '100%',
    height: '100%',
  },

  // Producer Info
  producerInfoContainer: {
    marginTop: 60, // Espace pour l'image de profil superposée
    paddingHorizontal: 20,
    alignItems: 'center', // Centrer le nom
  },
  producerNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  contactIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  contactDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-start', // Aligner à gauche dans le conteneur centré
  },
  contactIcon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 15,
    color: '#333',
  },
  bioText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'left', // Justifié ou à gauche selon le design
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 20,
  },

  // Products Section
  productsSectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Couleur de fond de la barre de recherche
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  productSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#e67e22', // Couleur pour la catégorie active
  },
  categoryChipText: {
    fontSize: 14,
    color: '#333',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    // Ombre subtile pour les cartes
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  productItemImage: {
    width: 100, // Taille ajustée
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productItemPrice: {
    fontSize: 15,
    color: '#e67e22', // Couleur du prix
    marginBottom: 8,
  },
  productActions: {
    alignItems: 'flex-end', // Aligner les actions à droite
    justifyContent: 'space-between', // Espacer quantité et bouton
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10, // Espace avant le bouton ajouter
  },
  addToCartButtonProd: {
    backgroundColor: '#e67e22',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addToCartButtonTextProd: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noProductsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  // Styles pour les anciens onglets (peuvent être supprimés ou réutilisés si besoin)
  tabContainer: {}, // Vide pour l'instant
  tabContent: {}, // Vide pour l'instant
  // ... (autres styles existants qui pourraient être supprimés si non utilisés)
}); 