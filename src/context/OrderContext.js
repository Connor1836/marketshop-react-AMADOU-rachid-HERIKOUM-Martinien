import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { getOrders, insertOrder, clearOrders } from '../data/db/database';

const OrderContext = createContext(null);

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, { orders: [], loading: false });

  const loadOrders = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const orders = await getOrders();
    dispatch({ type: 'SET_ORDERS', payload: orders });
  }, []);

  const placeOrder = useCallback(async ({ fullName, phone, address, city, cartItems, total }) => {
    const orderNumber = `CMD-${Date.now().toString().slice(-7)}`;
    const order = {
      order_number: orderNumber,
      date: new Date().toISOString(),
      full_name: fullName,
      phone,
      address,
      city,
      items: cartItems.map((i) => ({
        productId: i.product_id,
        title: i.title,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
      })),
      total,
    };
    await insertOrder(order);
    await loadOrders();
    return orderNumber;
  }, [loadOrders]);

  const clearAllOrders = useCallback(async () => {
    await clearOrders();
    dispatch({ type: 'SET_ORDERS', payload: [] });
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        loading: state.loading,
        loadOrders,
        placeOrder,
        clearAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders doit être utilisé dans OrderProvider');
  return context;
};
