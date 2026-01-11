import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESS, CONTRACT_METHODS } from '@/config/genlayer';
import { useWallet } from '@/contexts/WalletContext';

export const useContentValidator = () => {
  const { account } = useWallet();
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
        
        // Create client with studionet chain for GenLayer Studio
        const newClient = createClient({
          chain: studionet,
          account: account.address,
        });
        
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
  }, [account]);

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
      console.log('You can check status in GenLayer Studio or wait here...');
      console.log('Transaction hash to check:', txHash);

      // Wait for transaction to be ACCEPTED with explicit status
      console.log('Waiting for transaction to be accepted (this may take 30-60 seconds)...');
      console.log('The transaction involves AI processing which takes time...');
      
      let receipt;
      try {
        receipt = await client.waitForTransactionReceipt({
          hash: txHash,
          status: 'FINALIZED',  // ← Try FINALIZED instead of ACCEPTED
          retries: 300,  // 15 minutes max (300 * 3 seconds)
          interval: 3000,
        });
      } catch (waitError) {
        console.error('Wait error:', waitError);
        
        // Try to get the transaction manually to see what happened
        try {
          const tx = await client.getTransaction({ hash: txHash });
          console.log('Transaction details:', tx);
          console.log('Transaction status:', tx.status);
          console.log('Transaction statusName:', tx.statusName);
        } catch (getTxError) {
          console.error('Could not fetch transaction:', getTxError);
        }
        
        throw new Error(`Transaction did not finalize within expected time. Hash: ${txHash}. Check GenLayer Studio for status.`);
      }

      console.log('Transaction accepted!');
      console.log('Transaction receipt:', receipt);
      console.log('Receipt status:', receipt.status);
      console.log('Receipt status name:', receipt.statusName);
      console.log('Receipt result:', receipt.result);
      console.log('Receipt result_name:', receipt.result_name);
      console.log('Receipt data:', receipt.data);
      console.log('Receipt data.calldata:', receipt.data?.calldata);
      
      // Check if the transaction actually succeeded
      if (receipt.result !== 0 && receipt.result !== 6) {
        console.error('Transaction failed with result:', receipt.result, receipt.result_name);
        throw new Error(`Transaction failed: ${receipt.result_name || 'Unknown error'}`);
      }

      // Get the latest validation ID
      console.log('Fetching latest validation ID...');
      const latestValidationId = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_LATEST_VALIDATION_ID,
        args: [],
      });
      
      console.log('Latest validation ID raw:', latestValidationId);
      console.log('Latest validation ID type:', typeof latestValidationId);
      
      if (!latestValidationId || latestValidationId === '') {
        throw new Error('No validation ID returned - transaction may still be processing');
      }

      console.log('Latest validation ID:', latestValidationId);

      // Fetch the validation result
      const validationResult = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_VALIDATION,
        args: [latestValidationId],
      });

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
      console.log('Contract address:', CONTRACT_ADDRESS);
      console.log('Function name:', CONTRACT_METHODS.GET_USER_VALIDATIONS);
      console.log('Args:', [userAddress]);
      console.log('Args[0] type:', typeof userAddress);
      console.log('Args[0] value:', userAddress);
      
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
      console.error('Full error object:', err);
      
      // Try to get more details from the error
      if (err.cause) {
        console.error('Error cause:', err.cause);
      }
      if (err.details) {
        console.error('Error details:', err.details);
      }
      
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