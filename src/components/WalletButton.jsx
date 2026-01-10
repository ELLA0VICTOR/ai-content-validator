import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, X, Check, Zap } from 'lucide-react';

export function WalletButton() {
  const { account, isConnected, walletType, connectMetaMask, disconnect } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Connect Wallet</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isConnected && (
                <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connected Account</span>
                    <Badge variant="success" className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {getWalletLabel()}
                    </Badge>
                  </div>
                  <div className="font-mono text-sm bg-background p-3 rounded border border-border">
                    {account?.address}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDisconnect}
                    className="w-full"
                  >
                    Disconnect
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Choose how you want to connect:
                </p>

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

                {!isConnected && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                      <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-primary mb-1">Auto Account Active</div>
                        <div className="text-muted-foreground">
                          A temporary account has been automatically created. Connect an external wallet to persist your validations.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}