import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  getCartItems,
  insertCartItem,
  updateCartQuantity,
  deleteCartItem,
  clearCart,
} from '../data/db/database';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false });

  const loadCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const items = await getCartItems();
    dispatch({ type: 'SET_ITEMS', payload: items });
  }, []);

  const addItem = useCallback(async (product, quantity = 1) => {
    await insertCartItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity,
    });
    await loadCart();
  }, [loadCart]);

  const updateQuantity = useCallback(async (id, quantity) => {
    await updateCartQuantity(id, quantity);
    await loadCart();
  }, [loadCart]);

  const removeItem = useCallback(async (id) => {
    await deleteCartItem(id);
    await loadCart();
  }, [loadCart]);

  const emptyCart = useCallback(async () => {
    await clearCart();
    dispatch({ type: 'SET_ITEMS', payload: [] });
  }, []);

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        loading: state.loading,
        total,
        itemCount,
        loadCart,
        addItem,
        updateQuantity,
        removeItem,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart doit être utilisé dans CartProvider');
  return context;
};
