import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Award, Calendar, FileText } from 'lucide-react';
import { VALIDATION_CONFIG } from '@/config/genlayer';

export function ValidationResult({ result }) {
  if (!result) return null;

  // GenLayer returns a Map object, not a plain object
  // Use .get() to access Map values
  const score = Number(result.get?.('score') ?? result.score) || 0;
  const passed = Boolean(result.get?.('passed') ?? result.passed);
  const wordCount = Number(result.get?.('word_count') ?? result.word_count) || 0;
  const timestamp = Number(result.get?.('timestamp') ?? result.timestamp) || 0;
  const feedback = result.get?.('feedback') ?? result.feedback ?? 'No feedback provided';
  const validationId = result.get?.('validation_id') ?? result.validation_id ?? 'Unknown';
  const contentHash = result.get?.('content_hash') ?? result.content_hash ?? '';

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-400';
    if (score >= VALIDATION_CONFIG.PASSING_SCORE) return 'text-accent';
    if (score >= 50) return 'text-orange-400';
    return 'text-destructive';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= VALIDATION_CONFIG.PASSING_SCORE) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card className="w-full animate-fade-in animate-delay-100 border-2" style={{
      borderColor: passed ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'
    }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {passed ? (
              <CheckCircle2 className="h-6 w-6 text-accent" />
            ) : (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
            Validation Complete
          </CardTitle>
          <Badge variant={passed ? 'success' : 'destructive'} className="text-sm px-3 py-1">
            {passed ? 'PASSED' : 'FAILED'}
          </Badge>
        </div>
        <CardDescription>
          Validation ID: {validationId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">Quality Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getScoreColor()}`}>
                {score}
              </span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
          </div>
          
          <Progress value={score} className="h-3" />
          
          <p className="text-sm text-center text-muted-foreground">
            {getScoreLabel()} - {passed ? 'Meets quality standards' : 'Below quality threshold'}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            AI Feedback
          </h4>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm leading-relaxed">
              {feedback}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Word Count</p>
            <p className="text-2xl font-bold text-primary">{wordCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Timestamp
            </p>
            <p className="text-sm font-mono text-muted-foreground">
              Block #{timestamp}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <details className="group">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform">▶</span>
              View Content Preview
            </summary>
            <div className="mt-3 p-4 bg-secondary/30 rounded-lg">
              <p className="text-xs font-mono text-muted-foreground break-all">
                {contentHash}...
              </p>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}