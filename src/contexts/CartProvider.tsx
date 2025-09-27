
"use client";

import React, { createContext, useReducer, useContext, ReactNode, useEffect, useState } from 'react';
import type { CartItem, PreOrder, Product } from '@/lib/types';
import { getCategories } from '@/app/actions/category';
import { getProducts } from '@/app/actions/product';
import { getSetting, updateSetting } from '@/app/actions/setting';
import { AppSkeleton } from '@/components/AppSkeleton';

interface CartState {
  cartItems: CartItem[];
  shopName: string;
  deliveryFee: number;
  categories: string[];
  products: Product[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SHOP_NAME'; payload: string }
  | { type: 'SET_DELIVERY_FEE'; payload: number }
  | { type: 'SET_INITIAL_DATA'; payload: { products: Product[], categories: string[], shopName: string, deliveryFee: number } };


const initialState: CartState = {
  cartItems: [],
  shopName: 'ThreadLine',
  deliveryFee: 0,
  categories: [],
  products: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  updateShopName: (newName: string) => Promise<void>;
  updateDeliveryFee: (newFee: number) => Promise<void>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
        return {
            ...state,
            products: action.payload.products,
            categories: action.payload.categories,
            shopName: action.payload.shopName,
            deliveryFee: action.payload.deliveryFee,
        };
    case 'ADD_TO_CART': {
      const { product, size, quantity } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity += quantity;
        return { ...state, cartItems: updatedCartItems };
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size}-${Date.now()}`,
          product,
          size,
          quantity,
        };
        return { ...state, cartItems: [...state.cartItems, newItem] };
      }
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload.cartItemId),
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.cartItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    }
    case 'CLEAR_CART': {
        return {
            ...state,
            cartItems: [],
        };
    }
    case 'SET_SHOP_NAME': {
        return {
            ...state,
            shopName: action.payload,
        };
    }
    case 'SET_DELIVERY_FEE': {
        return {
            ...state,
            deliveryFee: action.payload,
        };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
            const [products, categories, shopNameSetting, deliveryFeeSetting] = await Promise.all([
                getProducts(),
                getCategories(),
                getSetting('shopName'),
                getSetting('deliveryFee'),
            ]);
            dispatch({ type: 'SET_INITIAL_DATA', payload: { 
                products, 
                categories: categories.map(c => c.name),
                shopName: shopNameSetting?.value || 'ThreadLine',
                deliveryFee: deliveryFeeSetting?.value ? parseFloat(deliveryFeeSetting.value) : 5,
            } });
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  const updateShopName = async (newName: string) => {
    await updateSetting('shopName', newName);
    dispatch({ type: 'SET_SHOP_NAME', payload: newName });
  };
  
  const updateDeliveryFee = async (newFee: number) => {
    await updateSetting('deliveryFee', newFee.toString());
    dispatch({ type: 'SET_DELIVERY_FEE', payload: newFee });
  };

  if (loading) {
    return <AppSkeleton />;
  }

  return (
    <CartContext.Provider value={{ state, dispatch, updateShopName, updateDeliveryFee }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
