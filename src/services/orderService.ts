import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Order {
  id?: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const COLLECTION_NAME = 'orders';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const orderWithTimestamps = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), orderWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};