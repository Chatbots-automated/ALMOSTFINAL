import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

/**
 * Fetch the user's cart from Firestore.
 */
export const getCart = async (userId: string): Promise<CartItem[]> => {
  if (!userId) return [];

  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      return cartSnap.data().items || [];
    }
    
    // Initialize empty cart if it doesn't exist
    await setDoc(cartRef, { items: [], updatedAt: new Date().toISOString() });
    return [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

/**
 * Adds an item to the cart or updates its quantity.
 */
export const addToCart = async (userId: string, item: CartItem): Promise<void> => {
  if (!userId) return;

  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const existingCart = cartSnap.data().items || [];
      const itemIndex = existingCart.findIndex((i: CartItem) => 
        i.id === item.id && 
        i.selectedSize === item.selectedSize && 
        i.selectedColor === item.selectedColor
      );

      if (itemIndex > -1) {
        // Update quantity if item already exists
        existingCart[itemIndex].quantity += item.quantity;
        await updateDoc(cartRef, { 
          items: existingCart,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Add new item to cart
        await updateDoc(cartRef, { 
          items: arrayUnion(item),
          updatedAt: new Date().toISOString()
        });
      }
    } else {
      // Create a new cart document
      await setDoc(cartRef, { 
        items: [item],
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Updates the quantity of an item in the cart.
 */
export const updateCartItemQuantity = async (
  userId: string, 
  itemId: string, 
  quantity: number,
  selectedSize?: string,
  selectedColor?: string
): Promise<void> => {
  if (!userId) return;

  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const existingCart = cartSnap.data().items || [];
      const updatedItems = existingCart.map((item: CartItem) => {
        if (
          item.id === itemId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        ) {
          return { ...item, quantity };
        }
        return item;
      });

      await updateDoc(cartRef, { 
        items: updatedItems,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

/**
 * Removes an item from the cart.
 */
export const removeFromCart = async (
  userId: string, 
  itemId: string,
  selectedSize?: string,
  selectedColor?: string
): Promise<void> => {
  if (!userId) return;

  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const existingCart = cartSnap.data().items || [];
      const updatedItems = existingCart.filter((item: CartItem) => 
        !(item.id === itemId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor)
      );

      await updateDoc(cartRef, { 
        items: updatedItems,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clears the entire cart.
 */
export const clearCart = async (userId: string): Promise<void> => {
  if (!userId) return;

  try {
    const cartRef = doc(db, "carts", userId);
    await updateDoc(cartRef, { 
      items: [],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};