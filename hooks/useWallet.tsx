"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface WalletState {
  address: string | null;
  privateKey: string | null;
  isConnected: boolean;
}

interface WalletContextType extends WalletState {
  connect: (address: string, privateKey: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    privateKey: null,
    isConnected: false,
  });

  const connect = useCallback((address: string, privateKey: string) => {
    // In production, use @aptos-labs/wallet-adapter-react or @shelby-protocol/react
    // for proper wallet signing — never store private keys in state for mainnet!
    setWallet({ address, privateKey, isConnected: true });
    // Persist address only (not key) to localStorage for reconnect UX
    if (typeof window !== "undefined") {
      localStorage.setItem("shelby_vault_address", address);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({ address: null, privateKey: null, isConnected: false });
    if (typeof window !== "undefined") {
      localStorage.removeItem("shelby_vault_address");
    }
  }, []);

  return (
    <WalletContext.Provider value={{ ...wallet, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
