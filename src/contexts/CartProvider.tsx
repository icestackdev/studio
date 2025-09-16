
"use client";

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import type { CartItem, PreOrder, Product } from '@/lib/types';
import { products as initialProducts, categories as initialCategories } from '@/lib/products';

const sampleOrders: PreOrder[] = [
    {
        id: 'PO-1672532400000',
        items: [
            { id: '1-M-1672532400000', product: initialProducts.find(p => p.id === '1')!, size: 'M', quantity: 1 },
            { id: '2-L-1672532400000', product: initialProducts.find(p => p.id === '2')!, size: 'L', quantity: 1 },
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
            { id: '3-L-1675209600000', product: initialProducts.find(p => p.id === '3')!, size: 'L', quantity: 2 },
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
     {
        id: 'PO-1677628800000',
        items: [
            { id: '4-32-1677628800000', product: initialProducts.find(p => p.id === '4')!, size: '32', quantity: 1 },
        ],
        customer: {
            name: 'Emily White',
            phone: '555-555-5555',
            address: '789 Pine Ln, Otherplace, USA',
        },
        total: 79.99,
        date: new Date('2023-03-01T12:00:00Z'),
        status: 'Pending',
    },
];


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
  | { type: 'CONFIRM_PRE_ORDER'; payload: { customer: PreOrder['customer'] } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: PreOrder['status'] } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_SHOP_NAME'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: string }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'EDIT_CATEGORY'; payload: { oldName: string; newName: string } };

const initialState: CartState = {
  cartItems: [],
  preOrders: sampleOrders,
  shopName: 'ThreadLine',
  categories: initialCategories,
  products: initialProducts,
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
    case 'UPDATE_ORDER_STATUS': {
        return {
            ...state,
            preOrders: state.preOrders.map(order => 
                order.id === action.payload.orderId 
                ? { ...order, status: action.payload.status } 
                : order
            )
        };
    }
    case 'UPDATE_SHOP_NAME': {
        return {
            ...state,
            shopName: action.payload,
        };
    }
    case 'ADD_CATEGORY': {
      if (state.categories.includes(action.payload)) return state;
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    }
    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(cat => cat !== action.payload)
      };
    }
    case 'EDIT_CATEGORY': {
      const { oldName, newName } = action.payload;
      if (state.categories.includes(newName)) return state;
      
      return {
        ...state,
        categories: state.categories.map(c => c === oldName ? newName : c),
        products: state.products.map(p => p.category === oldName ? { ...p, category: newName } : p)
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
