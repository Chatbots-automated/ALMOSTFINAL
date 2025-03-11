import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { CartItem, getCart, addToCart as addToFirestoreCart, removeFromCart as removeFromFirestoreCart, updateCartItemQuantity as updateFirestoreCartItemQuantity, clearCart as clearFirestoreCart } from '../services/cartService';

interface WishlistItem extends Product {}

interface StoreState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: CartItem, userId?: string) => void;
  removeFromCart: (id: string, userId?: string, selectedSize?: string, selectedColor?: string) => void;
  updateCartItemQuantity: (id: string, quantity: number, userId?: string, selectedSize?: string, selectedColor?: string) => void;
  clearCart: (userId?: string) => void;
  toggleWishlist: (item: Product) => void;
  getCartTotal: () => number;
  syncCart: (userId: string) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      
      syncCart: async (userId: string) => {
        if (!userId) return;
        try {
          const items = await getCart(userId);
          set({ cart: items });
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      },

      addToCart: async (item, userId) => {
        // Update local state
        set((state) => {
          const existingItem = state.cart.find(
            (i) => 
              i.id === item.id && 
              i.selectedSize === item.selectedSize && 
              i.selectedColor === item.selectedColor
          );

          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i === existingItem
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { cart: [...state.cart, item] };
        });

        // Update Firestore if userId is provided
        if (userId) {
          try {
            await addToFirestoreCart(userId, item);
          } catch (error) {
            console.error('Error adding to Firestore cart:', error);
          }
        }
      },

      removeFromCart: async (id, userId, selectedSize, selectedColor) => {
        // Update local state
        set((state) => ({
          cart: state.cart.filter((item) => 
            !(item.id === id && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor)
          ),
        }));

        // Update Firestore if userId is provided
        if (userId) {
          try {
            await removeFromFirestoreCart(userId, id, selectedSize, selectedColor);
          } catch (error) {
            console.error('Error removing from Firestore cart:', error);
          }
        }
      },

      updateCartItemQuantity: async (id, quantity, userId, selectedSize, selectedColor) => {
        // Update local state
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
              ? { ...item, quantity }
              : item
          ),
        }));

        // Update Firestore if userId is provided
        if (userId) {
          try {
            await updateFirestoreCartItemQuantity(userId, id, quantity, selectedSize, selectedColor);
          } catch (error) {
            console.error('Error updating Firestore cart quantity:', error);
          }
        }
      },

      clearCart: async (userId) => {
        // Update local state
        set({ cart: [] });

        // Update Firestore if userId is provided
        if (userId) {
          try {
            await clearFirestoreCart(userId);
          } catch (error) {
            console.error('Error clearing Firestore cart:', error);
          }
        }
      },

      toggleWishlist: (item) =>
        set((state) => {
          const exists = state.wishlist.some((i) => i.id === item.id);
          return {
            wishlist: exists
              ? state.wishlist.filter((i) => i.id !== item.id)
              : [...state.wishlist, item],
          };
        }),

      getCartTotal: () => {
        const state = get();
        return state.cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'elida-store',
    }
  )
);