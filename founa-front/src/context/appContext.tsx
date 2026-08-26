import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import type { ReactNode } from "react";

import { GetAllCommandeByClient } from "../services/order.service";

interface AppContextType {
  commandeCount: number;
  setCommandeCount: React.Dispatch<React.SetStateAction<number>>;
  refreshCommandeCount: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [commandeCount, setCommandeCount] = useState(0);

  const refreshCommandeCount = useCallback(async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const client_id = user.uid;

      if (!client_id) {
        setCommandeCount(0);
        return;
      }

      const res = await GetAllCommandeByClient({
        client_id,
      });

      if (res.data.status === "success") {
        const commandes = res.data.commandes || [];

        const nombreNonLues = commandes.filter(
          (commande: any) =>
            String(commande.view) === "1"
        ).length;

        setCommandeCount(nombreNonLues);
      } else {
        setCommandeCount(0);
      }
    } catch (error) {
      console.error(
        "Erreur récupération compteur commandes :",
        error
      );

      setCommandeCount(0);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        commandeCount,
        setCommandeCount,
        refreshCommandeCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp doit être utilisé à l'intérieur de AppProvider"
    );
  }

  return context;
};