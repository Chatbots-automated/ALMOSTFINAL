import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types/product';

const COLLECTION_NAME = 'products';

// Default product image if none is provided
const DEFAULT_PRODUCT_IMAGE = '/elida-logo.svg';

// Helper function to ensure price is a number and imageurl exists
const normalizeProduct = (data: any): Product => {
  return {
    id: data.id,
    name: data.name || '',
    category: data.category || '',
    description: data.description || '',
    price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
    sku: data.sku || '',
    imageurl: data.imageurl || DEFAULT_PRODUCT_IMAGE,
    variants: data.variants || undefined,
    features: data.features || undefined
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => normalizeProduct({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return normalizeProduct({
        id: docSnap.id,
        ...docSnap.data()
      });
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => normalizeProduct({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};