import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodiehub_cart') || '[]');
    } catch {
      localStorage.removeItem('foodiehub_cart');
      return [];
    }
  });

  const saveItems = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem('foodiehub_cart', JSON.stringify(nextItems));
  };
  const addItem = (menuItem) => {
    if (!menuItem.isAvailable) return;
    const existing = items.find((item) => item._id === menuItem._id);
    if (existing?.qty >= 99) return;
    saveItems(existing
      ? items.map((item) => item._id === menuItem._id ? { ...item, qty: item.qty + 1 } : item)
      : [...items, { ...menuItem, qty: 1 }]);
  };
  const updateQuantity = (id, qty) => {
    if (qty <= 0) return saveItems(items.filter((item) => item._id !== id));
    saveItems(items.map((item) => item._id === id ? { ...item, qty: Math.min(qty, 99) } : item));
  };
  const removeItem = (id) => saveItems(items.filter((item) => item._id !== id));
  const clearCart = () => saveItems([]);
  const itemCount = items.reduce((total, item) => total + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const value = useMemo(
    () => ({ items, itemCount, total, addItem, updateQuantity, removeItem, clearCart }),
    [items, itemCount, total]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider.');
  return context;
};
