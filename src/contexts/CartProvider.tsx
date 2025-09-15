"use client";

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import type { CartItem, PreOrder, Product } from '@/lib/types';
import { products } from '@/lib/products';

const sampleOrders: PreOrder[] = [
    {
        id: 'PO-1672532400000',
        items: [
            { id: '1-M-1672532400000', product: products.find(p => p.id === '1')!, size: 'M', quantity: 1 },
            { id: '2-L-1672532400000', product: products.find(p => p.id === '2')!, size: 'L', quantity: 1 },
        ],
        customer: {
            name: 'Jane Doe',
            phone: '123-456-7890',
            address: '123 Main St, Anytown, USA',
        },
        total: 339.98,
        date: new Date('2023-01-01T10:00:00Z'),
        status: 'Shipped',
    },
    {
        id: 'PO-1675209600000',
        items: [
            { id: '3-L-1675209600000', product: products.find(p => p.id === '3')!, size: 'L', quantity: 2 },
        ],
        customer: {
            name: 'John Smith',
            phone: '098-765-4321',
            address: '456 Oak Ave, Someville, USA',
        },
        total: 259.98,
        date: new Date('2023-02-01T12:00:00Z'),
        status: 'Confirmed',
    },
];


interface CartState {
  cartItems: CartItem[];
  preOrders: PreOrder[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CONFIRM_PRE_ORDER'; payload: { customer: PreOrder['customer'] } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  cartItems: [],
  preOrders: sampleOrders,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
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

      const total = state.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      const newPreOrder: PreOrder = {
        id: `PO-${Date.now()}`,
        items: [...state.cartItems],
        customer: action.payload.customer,
        date: new Date(),
        status: 'Pending',
        total,
      };

      return {
        ...state,
        cartItems: [],
        preOrders: [...state.preOrders, newPreOrder],
      };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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
