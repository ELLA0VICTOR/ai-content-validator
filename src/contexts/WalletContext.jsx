import { createContext, useContext, useState, useEffect } from 'react';
import { createAccount } from 'genlayer-js';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    connectAutoAccount();
  }, []);

  const connectAutoAccount = () => {
    try {
      const autoAccount = createAccount();
      setAccount(autoAccount);
      setIsConnected(true);
      setWalletType('auto');
      setError(null);
    } catch (err) {
      setError('Failed to create account');
    }
  };

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not installed');
        return false;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const metaMaskAccount = {
          address: accounts[0],
          type: 'metamask'
        };
        
        setAccount(metaMaskAccount);
        setIsConnected(true);
        setWalletType('metamask');
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Failed to connect MetaMask');
      return false;
    }
  };

  const connectWalletConnect = async () => {
    setError('WalletConnect integration coming soon');
    return false;
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setWalletType(null);
    setError(null);
    
    setTimeout(() => {
      connectAutoAccount();
    }, 100);
  };

  const value = {
    account,
    isConnected,
    walletType,
    error,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}