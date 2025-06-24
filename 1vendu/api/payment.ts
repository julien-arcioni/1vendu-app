import axiosInstance from './axiosConfig';

interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  cartItems: any[];
  metadata?: any;
}

interface PaymentIntentResponse {
  success: boolean;
  paymentIntent: {
    id: string;
    client_secret: string;
    amount: number;
    currency: string;
  };
  payment: {
    id: string;
    documentId: string;
    amount: number;
    currency: string;
    status: string;
  };
}

interface PaymentResponse {
  success: boolean;
  payment: any;
}

interface PaymentsResponse {
  success: boolean;
  payments: any[];
}

/**
 * Crée un Payment Intent pour le paiement
 * @param {PaymentIntentRequest} paymentData - Données du paiement
 * @returns {Promise<PaymentIntentResponse>} Payment Intent créé
 */
export const createPaymentIntent = async (paymentData: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
  try {
    const response = await axiosInstance.post('/api/payments/create-payment-intent', paymentData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du Payment Intent:', error);
    throw error;
  }
};

/**
 * Récupère les détails d'un paiement
 * @param {string} paymentId - ID du paiement
 * @returns {Promise<PaymentResponse>} Détails du paiement
 */
export const getPayment = async (paymentId: string): Promise<PaymentResponse> => {
  try {
    const response = await axiosInstance.get(`/api/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    throw error;
  }
};

/**
 * Récupère tous les paiements de l'utilisateur connecté
 * @returns {Promise<PaymentsResponse>} Liste des paiements
 */
export const getUserPayments = async (): Promise<PaymentsResponse> => {
  try {
    const response = await axiosInstance.get('/api/payments/user-payments');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    throw error;
  }
};

export default {
  createPaymentIntent,
  getPayment,
  getUserPayments,
};