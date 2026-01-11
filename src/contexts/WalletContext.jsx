import { createContext, useContext, useState, useEffect } from 'react';
import { createAccount } from 'genlayer-js';

const WalletContext = createContext(null);

// GenLayer Studio network configuration
// Try the Chain ID from your existing MetaMask config
const GENLAYER_STUDIO_NETWORK = {
  chainId: '0xf22f', // 62255 in decimal (your MetaMask config)
  chainName: 'GenLayer Studio',
  rpcUrls: ['https://studio.genlayer.com/api'],
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18
  },
};

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

  const switchToGenLayerNetwork = async () => {
    try {
      // Try to switch to GenLayer Studio network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: GENLAYER_STUDIO_NETWORK.chainId }],
      });
      return true;
    } catch (switchError) {
      // Network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [GENLAYER_STUDIO_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add GenLayer network:', addError);
          return false;
        }
      }
      console.error('Failed to switch network:', switchError);
      return false;
    }
  };

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not installed');
        return false;
      }

      // First, switch to GenLayer network
      const networkSwitched = await switchToGenLayerNetwork();
      if (!networkSwitched) {
        setError('Please switch to GenLayer Studio network in MetaMask');
        return false;
      }

      // Request account access
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