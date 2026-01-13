import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESS, CONTRACT_METHODS } from '@/config/genlayer';
import { useWallet } from '@/contexts/WalletContext';

export const useContentValidator = () => {
  const { account, walletType } = useWallet();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      if (!account) {
        setInitialized(false);
        setClient(null);
        return;
      }

      try {
        console.log('Initializing client with account:', account.address);
        console.log('Wallet type:', walletType);
        
        let newClient;
        
        if (walletType === 'auto') {
          // For auto accounts, pass the FULL account object (includes private key)
          newClient = createClient({
            chain: studionet,
            account: account, // ✅ Pass the entire account object, not just address
          });
        } else if (walletType === 'metamask') {
          // For MetaMask, we need to handle it differently
          // MetaMask uses window.ethereum provider for signing
          // NOTE: This might require additional setup - check GenLayer docs
          console.warn('MetaMask support is experimental');
          newClient = createClient({
            chain: studionet,
            account: account.address, // For MetaMask, address string might work
          });
        }
        
        console.log('Client created successfully');
        
        setClient(newClient);
        setInitialized(true);
        setError(null);
      } catch (err) {
        setError(`Failed to initialize client: ${err.message}`);
        setInitialized(false);
        console.error('Client initialization error:', err);
      }
    };

    initClient();
  }, [account, walletType]);

  const validateContent = useCallback(async (content, minWords) => {
    if (!client || !initialized) {
      const error = 'Client not initialized. Please wait...';
      setError(error);
      return null;
    }

    if (!CONTRACT_ADDRESS) {
      const error = 'Contract address not configured. Please set VITE_CONTRACT_ADDRESS in .env';
      setError(error);
      return null;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Submitting validation transaction...');
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.VALIDATE_CONTENT,
        args: [content, minWords],
        value: 0n,
      });

      console.log('Transaction submitted:', txHash);
      console.log('Waiting for transaction to be finalized (this may take 30-60 seconds)...');
      
      let receipt;
      try {
        receipt = await client.waitForTransactionReceipt({
          hash: txHash,
          status: 'FINALIZED',
          retries: 300,
          interval: 3000,
        });
      } catch (waitError) {
        console.error('Wait error:', waitError);
        
        try {
          const tx = await client.getTransaction({ hash: txHash });
          console.log('Transaction details:', tx);
        } catch (getTxError) {
          console.error('Could not fetch transaction:', getTxError);
        }
        
        throw new Error(`Transaction did not finalize within expected time. Hash: ${txHash}`);
      }

      console.log('Transaction finalized!');
      console.log('Receipt:', receipt);
      
      if (receipt.result !== 0 && receipt.result !== 6) {
        console.error('Transaction failed:', receipt.result, receipt.result_name);
        throw new Error(`Transaction failed: ${receipt.result_name || 'Unknown error'}`);
      }

      // Get the latest validation ID
      const latestValidationId = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_LATEST_VALIDATION_ID,
        args: [],
      });
      
      if (!latestValidationId || latestValidationId === '') {
        throw new Error('No validation ID returned');
      }

      console.log('Latest validation ID:', latestValidationId);

      // Fetch the validation result
      const validationResult = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_VALIDATION,
        args: [latestValidationId],
      });

      console.log('Validation result:', validationResult);

      setResult(validationResult);
      return validationResult;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred during validation';
      setError(errorMsg);
      console.error('Validation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client, initialized]);

  const getValidationHistory = useCallback(async (userAddress) => {
    if (!client || !initialized) {
      setError('Client not initialized');
      return [];
    }

    if (!CONTRACT_ADDRESS) {
      setError('Contract address not configured');
      return [];
    }

    if (!userAddress) {
      setError('User address is required');
      return [];
    }

    try {
      console.log('Fetching validation history for:', userAddress);
      
      const history = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_USER_VALIDATIONS,
        args: [userAddress],
      });

      console.log('Validation history SUCCESS:', history);
      return history || [];
    } catch (err) {
      const errorMsg = `Failed to fetch history: ${err.message}`;
      setError(errorMsg);
      console.error('History fetch error:', err);
      return [];
    }
  }, [client, initialized]);

  const getValidationCount = useCallback(async () => {
    if (!client || !initialized) {
      return 0;
    }

    if (!CONTRACT_ADDRESS) {
      return 0;
    }

    try {
      const count = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_VALIDATION_COUNT,
        args: [],
      });

      console.log('Validation count:', count);
      return Number(count) || 0;
    } catch (err) {
      console.error('Failed to fetch validation count:', err);
      return 0;
    }
  }, [client, initialized]);

  const getValidation = useCallback(async (validationId) => {
    if (!client || !initialized) {
      setError('Client not initialized');
      return null;
    }

    if (!CONTRACT_ADDRESS) {
      setError('Contract address not configured');
      return null;
    }

    if (!validationId) {
      setError('Validation ID is required');
      return null;
    }

    try {
      const validation = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_VALIDATION,
        args: [validationId],
      });

      return validation;
    } catch (err) {
      const errorMsg = `Failed to fetch validation: ${err.message}`;
      setError(errorMsg);
      console.error('Validation fetch error:', err);
      return null;
    }
  }, [client, initialized]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    validateContent,
    getValidationHistory,
    getValidationCount,
    getValidation,
    clearError,
    loading,
    error,
    result,
    initialized,
    client,
  };
};