
"use client";

import React, { createContext, useReducer, useContext, ReactNode, useEffect, useState } from 'react';
import type { CartItem, PreOrder, Product } from '@/lib/types';
import { getCategories } from '@/app/actions/category';
import { getProducts } from '@/app/actions/product';
import { getOrders } from '@/app/actions/order';

interface CartState {
  cartItems: CartItem[];
  preOrders: PreOrder[];
  shopName: string;
  categories: string[];
  products: Product[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CONFIRM_PRE_ORDER'; payload: { customer: PreOrder['customer'], total: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_SHOP_NAME'; payload: string }
  | { type: 'SET_INITIAL_DATA'; payload: { products: Product[], categories: string[], orders: PreOrder[] } };


const initialState: CartState = {
  cartItems: [],
  preOrders: [],
  shopName: 'ThreadLine',
  categories: [],
  products: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
        return {
            ...state,
            products: action.payload.products,
            categories: action.payload.categories,
            preOrders: action.payload.orders,
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
    case 'CONFIRM_PRE_ORDER': {
      if (state.cartItems.length === 0) return state;

      const newPreOrder: PreOrder = {
        id: `PO-${Date.now()}`,
        items: [...state.cartItems],
        customer: action.payload.customer,
        date: new Date(),
        status: 'Pending',
        total: action.payload.total,
      };

      return {
        ...state,
        cartItems: [],
        preOrders: [...state.preOrders, newPreOrder],
      };
    }
    case 'UPDATE_SHOP_NAME': {
        return {
            ...state,
            shopName: action.payload,
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
            const [products, categories, orders] = await Promise.all([
                getProducts(),
                getCategories(),
                getOrders()
            ]);
            dispatch({ type: 'SET_INITIAL_DATA', payload: { 
                products, 
                categories: categories.map(c => c.name),
                orders: orders as PreOrder[],
            } });
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div>Loading...</div>
        </div>
    );
  }

  return (
    <CartContext.Provider value={{ state, dispatch }}>
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
