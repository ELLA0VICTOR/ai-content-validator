import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, X, Check, Zap, Copy, CheckCheck, AlertCircle } from 'lucide-react';

export function WalletButton() {
  const { account, isConnected, walletType, connectMetaMask, disconnect, error: walletError } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleConnect = async (type) => {
    setConnecting(true);
    
    try {
      if (type === 'metamask') {
        const success = await connectMetaMask();
        if (success) {
          setShowModal(false);
        }
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowModal(false);
    setShowDisconnectConfirm(false);
  };

  const handleCopyAddress = async () => {
    if (!account?.address) return;
    
    try {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getWalletLabel = () => {
    if (walletType === 'metamask') return 'MetaMask';
    if (walletType === 'auto') return 'Auto';
    return 'Wallet';
  };

  const getWalletBadgeColor = () => {
    if (walletType === 'metamask') return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (walletType === 'auto') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-secondary/50 text-muted-foreground';
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        {isConnected ? (
          <>
            <span className="hidden sm:inline">{getWalletLabel()}:</span>
            <span className="font-mono text-xs">{formatAddress(account?.address)}</span>
          </>
        ) : (
          'Connect Wallet'
        )}
      </Button>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setShowDisconnectConfirm(false);
            }
          }}
        >
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {showDisconnectConfirm ? 'Disconnect Wallet?' : 'Connect Wallet'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Disconnect Confirmation */}
              {showDisconnectConfirm ? (
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Warning</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {walletType === 'auto' 
                        ? 'Disconnecting will create a new auto-generated account. Your current account will be lost.'
                        : 'Are you sure you want to disconnect your wallet?'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDisconnectConfirm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDisconnect}
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Connected Account Display */}
                  {isConnected && (
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Connected Account</span>
                        <Badge className={`flex items-center gap-1 ${getWalletBadgeColor()}`}>
                          <Check className="h-3 w-3" />
                          {getWalletLabel()}
                        </Badge>
                      </div>
                      
                      {/* Address with Copy Button */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-background p-3 rounded border border-border">
                          <span className="font-mono text-sm flex-1 truncate">
                            {account?.address}
                          </span>
                          <button
                            onClick={handleCopyAddress}
                            className="p-2 hover:bg-secondary rounded transition-colors flex-shrink-0"
                            title="Copy address"
                          >
                            {copied ? (
                              <CheckCheck className="h-4 w-4 text-accent" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        {copied && (
                          <p className="text-xs text-accent animate-in fade-in duration-200">
                            Address copied to clipboard!
                          </p>
                        )}
                      </div>

                      <Button
                        variant="destructive"
                        onClick={() => setShowDisconnectConfirm(true)}
                        className="w-full"
                      >
                        Disconnect
                      </Button>
                    </div>
                  )}

                  {/* Wallet Connection Options */}
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {isConnected ? 'Switch to a different wallet:' : 'Choose how you want to connect:'}
                    </p>

                    {/* MetaMask Option */}
                    <button
                      onClick={() => handleConnect('metamask')}
                      disabled={connecting || (isConnected && walletType === 'metamask')}
                      className="w-full p-4 border-2 border-border hover:border-primary rounded-lg transition-all hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                          <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
                            <path d="M32.5 5L22 17.5L24 10L32.5 5Z" fill="#E17726" />
                            <path d="M7.5 5L18 17.5L16 10L7.5 5Z" fill="#E27625" />
                            <path d="M28 28L25 33L32 35L34 28H28Z" fill="#E27625" />
                            <path d="M6 28L8 35L15 33L12 28H6Z" fill="#E27625" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">MetaMask</div>
                          <div className="text-xs text-muted-foreground">
                            Connect using MetaMask wallet
                          </div>
                        </div>
                        {isConnected && walletType === 'metamask' && (
                          <Check className="h-5 w-5 text-accent" />
                        )}
                      </div>
                    </button>

                    {/* WalletConnect Option (Disabled) */}
                    <button
                      disabled
                      className="w-full p-4 border-2 border-border rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <Wallet className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">WalletConnect</div>
                          <div className="text-xs text-muted-foreground">
                            Coming soon
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Auto Account Info */}
                    {walletType === 'auto' && (
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                          <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <div className="font-medium text-primary mb-1">Auto Account Active</div>
                            <div className="text-muted-foreground">
                              You're using a temporary auto-generated account. Connect an external wallet like MetaMask to persist your data across sessions.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error Display */}
                    {walletError && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-destructive">{walletError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}