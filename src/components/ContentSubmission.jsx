import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { VALIDATION_CONFIG } from '@/config/genlayer';

export function ContentSubmission({ onValidate, loading, error }) {
  const [content, setContent] = useState('');
  const [minWords, setMinWords] = useState(VALIDATION_CONFIG.MIN_WORDS_DEFAULT);
  const [validationError, setValidationError] = useState('');

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!content.trim()) {
      setValidationError('Please enter some content to validate');
      return;
    }

    if (wordCount < minWords) {
      setValidationError(`Content must have at least ${minWords} words. Current: ${wordCount}`);
      return;
    }

    if (charCount > VALIDATION_CONFIG.MAX_CHARS) {
      setValidationError(`Content exceeds maximum length of ${VALIDATION_CONFIG.MAX_CHARS} characters`);
      return;
    }

    if (minWords <= 0) {
      setValidationError('Minimum words must be greater than 0');
      return;
    }

    try {
      await onValidate(content, minWords);
    } catch (err) {
      setValidationError(err.message);
    }
  };

  const handleClear = () => {
    setContent('');
    setValidationError('');
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Submit Content for Validation
        </CardTitle>
        <CardDescription>
          Enter your content below and let AI analyze its quality, grammar, and readability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Your Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type your content here... This could be an article, blog post, product description, or any text you want validated."
              className="min-h-[300px] font-mono text-sm resize-none"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={wordCount < minWords ? 'text-destructive' : 'text-accent'}>
                Words: {wordCount} / {minWords} minimum
              </span>
              <span className={charCount > VALIDATION_CONFIG.MAX_CHARS ? 'text-destructive' : ''}>
                Characters: {charCount} / {VALIDATION_CONFIG.MAX_CHARS}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="minWords" className="text-sm font-medium">
              Minimum Word Count
            </label>
            <Input
              id="minWords"
              type="number"
              value={minWords}
              onChange={(e) => setMinWords(Number(e.target.value))}
              min="1"
              max="1000"
              className="w-32"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Set the minimum required words for validation
            </p>
          </div>

          {(validationError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validationError || error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !content.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                'Validate Content'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClear}
              disabled={loading || !content}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}