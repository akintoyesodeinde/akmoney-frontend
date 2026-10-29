import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Wallet } from '../types/wallet';
import { walletService } from '../services/walletService';
import { useAuth } from './AuthContext';

interface WalletContextType {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  setSelectedWallet: (wallet: Wallet | null) => void;
  refreshWallets: () => Promise<void>;
  defaultWallet: Wallet | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshWallets = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await walletService.getWallets();
      setWallets(data);
      if (data.length > 0 && !selectedWallet) {
        const def = data.find((w) => w.is_default === 1) || data[0];
        setSelectedWallet(def);
      }
    } catch (e) {
      console.error('Failed to load wallets:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedWallet]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWallets();
    } else {
      setWallets([]);
      setSelectedWallet(null);
    }
  }, [isAuthenticated, refreshWallets]);

  const defaultWallet = wallets.find((w) => w.is_default === 1) || wallets[0] || null;

  return (
    <WalletContext.Provider
      value={{
        wallets,
        selectedWallet,
        isLoading,
        setSelectedWallet,
        refreshWallets,
        defaultWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
