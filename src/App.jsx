import { useState, useEffect } from 'react';
import { ContentSubmission } from '@/components/ContentSubmission';
import { ValidationResult } from '@/components/ValidationResult';
import { ValidationHistory } from '@/components/ValidationHistory';
import { HowItWorks } from '@/components/HowItWorks';
import { WalletButton } from '@/components/WalletButton';
import { useContentValidator } from '@/hooks/useContentValidator';
import { useWallet } from '@/contexts/WalletContext';
import { Sparkles, Github, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function App() {
  const { account, isConnected, walletType } = useWallet();
  const {
    validateContent,
    getValidationHistory,
    getValidationCount,
    loading,
    error,
    result,
    initialized,
  } = useContentValidator();

  const [totalValidations, setTotalValidations] = useState(0);

  useEffect(() => {
    if (initialized) {
      loadValidationCount();
    }
  }, [initialized, result]);

  const loadValidationCount = async () => {
    const count = await getValidationCount();
    setTotalValidations(count);
  };

  const handleValidate = async (content, minWords) => {
    await validateContent(content, minWords);
  };

  return (
    <div className="min-h-screen bg-background ">
      
      
      <div className="relative">
        <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#e94960] ">
                    Authen Protocol
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Powered by GenLayer Intelligent Contracts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WalletButton />
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Total Validations:</span>
                  <span className="text-lg font-bold text-primary">{totalValidations}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 space-y-12">
          {!initialized && (
            <Alert className="animate-fade-in">
              <AlertDescription className="flex items-center gap-2">
                <span className="animate-spin">⚙️</span>
                Initializing GenLayer client...
              </AlertDescription>
            </Alert>
          )}

          {initialized && !account?.address && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertDescription>
                Failed to create account. Please refresh the page.
              </AlertDescription>
            </Alert>
          )}

          {initialized && isConnected && (
            <div className="space-y-8">
              <div className="text-center space-y-2 animate-fade-in">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Connected Account:{' '}
                    <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">
                      {account.address.slice(0, 10)}...{account.address.slice(-8)}
                    </span>
                  </p>
                  {walletType === 'auto' && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Auto</span>
                  )}
                  {walletType === 'metamask' && (
                    <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded">MetaMask</span>
                  )}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <ContentSubmission 
                    onValidate={handleValidate}
                    loading={loading}
                    error={error}
                  />
                </div>

                <div className="space-y-8">
                  {result && <ValidationResult result={result} />}
                  
                  {!result && (
                    <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border-2 border-dashed border-border/50 animate-fade-in">
                      <div className="text-center space-y-3 p-8">
                        <Sparkles className="h-16 w-16 mx-auto text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          Submit content to see validation results
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ValidationHistory 
                getHistory={getValidationHistory}
                account={account}
              />

              <HowItWorks />
            </div>
          )}
        </main>

        <footer className="border-t border-border/50 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  Built with GenLayer Intelligent Contracts
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Decentralized AI-powered content validation
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://genlayer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Learn about GenLayer
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;