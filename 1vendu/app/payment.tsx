import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import Header from '@/components/navigation/Header';
import CustomButton from '@/components/button/CustomButton';
import Colors from '@/constants/Colors';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { createPaymentIntent } from '@/api/payment';

// Clé publique Stripe de test
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RVtcZCv1HFpG5J3jJqzK2lVgw3blwN7aIokFZUUx2dreMiZT1Crd2DshkBZCT7Bm3m3fyfCJ3Hoi1BoLMLrIAL7003wmvLCtd';

const PaymentContent = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { cartItems, total, getCartItemsCount, clearCartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  const initializePaymentSheet = async (showErrorAlert: boolean = true) => {
    try {
      setLoading(true);

      // Vérifier que nous avons bien des articles dans le panier
      if (!cartItems || cartItems.length === 0) {
        if (showErrorAlert) {
          Alert.alert('Panier vide', 'Votre panier est vide.');
        }
        return false;
      }

      // Préparer les données du panier pour l'API
      const cartItemsForPayment = cartItems.map(item => ({
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
        },
        quantity: item.quantity,
      }));

      // Créer le Payment Intent via notre API Strapi
      const paymentData = await createPaymentIntent({
        amount: total,
        currency: 'eur',
        cartItems: cartItemsForPayment,
        metadata: {
          source: 'mobile_app',
          itemCount: getCartItemsCount(),
        },
      });

      if (!paymentData.success) {
        throw new Error('Erreur lors de la création du Payment Intent');
      }

      setPaymentIntent(paymentData.paymentIntent);

      // Initialiser le Payment Sheet avec le client secret reçu
      const { error } = await initPaymentSheet({
        merchantDisplayName: '1vendu',
        paymentIntentClientSecret: paymentData.paymentIntent.client_secret,
        defaultBillingDetails: {
          name: 'Client 1vendu',
        },
        appearance: {
          colors: {
            primary: Colors.primary || '#e67e22',
          },
        },
        allowsDelayedPaymentMethods: false,
      });

      if (error) {
        console.error('Erreur initialisation PaymentSheet:', error);
        throw new Error('Erreur lors de l\'initialisation du paiement');
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      
      // N'afficher l'alerte d'erreur que si demandé (pas pour les tentatives automatiques)
      if (showErrorAlert) {
        Alert.alert(
          'Erreur de paiement',
          'Impossible d\'initialiser le paiement. Veuillez réessayer.',
          [{ text: 'OK' }]
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour effectuer un paiement.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Panier vide', 'Votre panier est vide.');
      return;
    }

    try {
      setLoading(true);

      // S'assurer que le Payment Sheet est initialisé (avec alerte d'erreur cette fois)
      if (!paymentIntent) {
        const initialized = await initializePaymentSheet(true);
        if (!initialized) {
          return;
        }
      }

      // Présenter le Payment Sheet
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === 'Canceled') {
          // L'utilisateur a annulé, ne pas afficher d'erreur
          return;
        }
        Alert.alert('Erreur de paiement', error.message);
      } else {
        // Paiement réussi
        Alert.alert(
          'Paiement réussi!', 
          'Votre commande a été confirmée. Vous recevrez un email de confirmation.',
          [
            {
              text: 'Parfait !',
              onPress: () => {
                // Vider le panier et retourner à l'accueil
                clearCartItems();
                router.push('/(tabs)/home');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Préparer le paiement au chargement du composant (sans afficher d'erreur)
  useEffect(() => {
    if (isAuthenticated && cartItems.length > 0 && !paymentIntent && total > 0) {
      // Délai pour s'assurer que toutes les données sont chargées
      const timeoutId = setTimeout(() => {
        initializePaymentSheet(false); // false = ne pas afficher d'alerte d'erreur
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, cartItems.length, total, paymentIntent]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Vous devez être connecté pour accéder au paiement.</Text>
          <CustomButton
            title="Se connecter"
            type="primary"
            backgroundColor={Colors.primary}
            textColor="#FFFFFF"
            onPress={() => router.push('/(tabs)/auth/login')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Votre panier est vide.</Text>
          <CustomButton
            title="Retour aux achats"
            type="primary"
            backgroundColor={Colors.primary}
            textColor="#FFFFFF"
            onPress={() => router.push('/(tabs)/home')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Récapitulatif de commande</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nombre d'articles:</Text>
            <Text style={styles.summaryValue}>{getCartItemsCount()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total:</Text>
            <Text style={styles.summaryValue}>{total.toFixed(2).replace('.', ',')} €</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de livraison:</Text>
            <Text style={styles.summaryValue}>Gratuit</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{total.toFixed(2).replace('.', ',')} €</Text>
          </View>
        </View>

        <View style={styles.paymentInfo}>
          <Text style={styles.sectionTitle}>Informations de paiement</Text>
          <Text style={styles.infoText}>
            Paiement sécurisé via Stripe. Vos informations bancaires sont protégées et cryptées.
          </Text>
          
          {loading && !paymentIntent && (
            <View style={styles.paymentLoadingContainer}>
              <Text style={styles.paymentLoadingText}>⏳ Préparation du paiement...</Text>
            </View>
          )}
          
          {paymentIntent && !loading && (
            <View style={styles.paymentReadyContainer}>
              <Text style={styles.paymentReadyText}>✓ Paiement prêt</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Retour au panier"
          type="secondary"
          backgroundColor="#f0f0f0"
          textColor="#333"
          onPress={() => router.back()}
          style={{ marginBottom: 10 }}
        />
        
        <CustomButton
          title={loading ? "Préparation..." : "Payer maintenant"}
          type="primary"
          backgroundColor={Colors.primary}
          textColor="#FFFFFF"
          onPress={openPaymentSheet}
          disabled={loading || cartItems.length === 0}
        />
      </View>
    </SafeAreaView>
  );
};

const PaymentScreen = () => {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <PaymentContent />
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary || '#e67e22',
  },
  paymentInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  paymentLoadingContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  paymentLoadingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  paymentReadyContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 6,
  },
  paymentReadyText: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#FBFBFB',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PaymentScreen; 