// src/context/CartContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


// Type pour un produit dans le panier
type CartItem = {
  uid: string;
  nom: string;
  prix: number;
  qty: number;
  image?: string;
};

// Type du contexte du panier
type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (uid: string) => void;
  clear: () => void;
};

// Création du contexte avec undefined par défaut
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props du provider
type CartProviderProps = {
  children: ReactNode;
};

// Provider du panier
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Ajouter un produit au panier
  const add = (item: CartItem) => {
    setItems(prev => {
      const found = prev.find(p => p.uid === item.uid);
      if (found) {
        return prev.map(p => p.uid === item.uid ? { ...p, qty: p.qty + item.qty } : p);
      }
      return [...prev, item];
    });
  };

  // Supprimer un produit du panier
  const remove = (uid: string) => {
    setItems(prev => prev.filter(item => item.uid !== uid));
  };

  // Vider le panier
  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le panier
export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
