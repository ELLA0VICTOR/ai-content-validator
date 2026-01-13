import { useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, CheckCircle2, XCircle, TrendingUp, Loader2 } from 'lucide-react';

export function ValidationHistory({ getHistory, account, refreshTriggerRef }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const loadHistory = useCallback(async () => {
    if (!account?.address) return;
    
    setLoading(true);
    try {
      const data = await getHistory(account.address);
      
      // Convert Map objects to plain objects for easier handling
      const normalizedData = (data || []).map(item => {
        // Handle both Map objects and plain objects
        const getField = (field) => item.get?.(field) ?? item[field];
        
        return {
          validation_id: getField('validation_id'),
          content_hash: getField('content_hash'),
          author: getField('author'),
          score: Number(getField('score')) || 0,
          passed: Boolean(getField('passed')),
          feedback: getField('feedback') || 'No feedback',
          timestamp: Number(getField('timestamp')) || 0,
          word_count: Number(getField('word_count')) || 0,
        };
      });
      
      setHistory(normalizedData);
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [getHistory, account?.address]);

  // Expose loadHistory to parent via ref
  useImperativeHandle(refreshTriggerRef, () => loadHistory, [loadHistory]);

  // Auto-load on mount and when account changes
  useEffect(() => {
    if (account?.address) {
      loadHistory();
    }
  }, [account?.address, loadHistory]);

  const filteredHistory = history.filter(item => {
    if (filter === 'passed') return item.passed;
    if (filter === 'failed') return !item.passed;
    return true;
  });

  const stats = {
    total: history.length,
    passed: history.filter(h => h.passed).length,
    failed: history.filter(h => !h.passed).length,
    avgScore: history.length > 0 
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
      : 0,
  };

  return (
    <Card className="w-full animate-fade-in animate-delay-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              Validation History
            </CardTitle>
            <CardDescription>
              Your past content validation results
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadHistory}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {history.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1 text-center p-3 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="space-y-1 text-center p-3 bg-accent/10 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase">Passed</p>
              <p className="text-2xl font-bold text-accent">{stats.passed}</p>
            </div>
            <div className="space-y-1 text-center p-3 bg-destructive/10 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase">Failed</p>
              <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
            </div>
            <div className="space-y-1 text-center p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Avg Score
              </p>
              <p className="text-2xl font-bold text-primary">{stats.avgScore}</p>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex gap-2 border-t border-b border-border py-3">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({history.length})
            </Button>
            <Button
              variant={filter === 'passed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('passed')}
            >
              Passed ({stats.passed})
            </Button>
            <Button
              variant={filter === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('failed')}
            >
              Failed ({stats.failed})
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {history.length === 0 
                ? 'No validations yet. Submit your first content above!'
                : 'No validations match the current filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item, index) => (
              <div
                key={item.validation_id}
                className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {item.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.validation_id}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.content_hash}...
                    </p>
                    <p className="text-sm">{item.feedback}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{item.word_count} words</span>
                      <span>•</span>
                      <span>Block #{item.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={item.passed ? 'success' : 'destructive'}>
                      {item.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">
                      {item.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}