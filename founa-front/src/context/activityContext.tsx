// src/context/ActivityContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


/* ================= TYPES ================= */

// Favori
export type FavoriteItem = {  
  uid: string;
  nom: string;
  image?: string;
};

// Historique
export type HistoryItem = {
  id: string;
  title: string;
  date: string;
};

// Contexte
type ActivityContextType = {
  favorites: FavoriteItem[];
  history: HistoryItem[];

  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (uid: string) => void;
  isFavorite: (uid: string) => boolean;

  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
};

/* ================= CONTEXT ================= */

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

type ActivityProviderProps = {
  children: ReactNode;
};

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /* ⭐ Favoris */
  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) =>
      prev.some((f) => f.uid === item.uid) ? prev : [...prev, item]
    );
  };

  const removeFavorite = (uid: string) => {
    setFavorites((prev) => prev.filter((item) => item.uid !== uid));
  };

  const isFavorite = (uid: string) => {
    return favorites.some((item) => item.uid === uid);
  };

  /* 🕘 Historique */
  const addHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const clearHistory = () => setHistory([]);

  return (
    <ActivityContext.Provider
      value={{
        favorites,
        history,
        addFavorite,
        removeFavorite,
        isFavorite,
        addHistory,
        clearHistory,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

/* ================= HOOK ================= */

// eslint-disable-next-line react-refresh/only-export-components
export const useActivity = (): ActivityContextType => {
  const ctx = useContext(ActivityContext);
  if (!ctx) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return ctx;
};
