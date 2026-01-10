import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Database, Shield, Zap } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Advanced language models analyze your content for grammar, readability, and quality using GenLayer\'s gl.exec_prompt() function.',
    },
    {
      icon: Shield,
      title: 'Consensus Validation',
      description: 'Multiple validators reach consensus on the content quality, ensuring unbiased and reliable results.',
    },
    {
      icon: Database,
      title: 'On-Chain Storage',
      description: 'Validation results are permanently stored on the blockchain using Intelligent Contracts.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get detailed feedback with scores, pass/fail status, and actionable recommendations.',
    },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in animate-delay-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered content validation leveraging GenLayer's Intelligent Contracts for transparent, 
          decentralized quality assessment
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <Card 
            key={index}
            className="relative overflow-hidden group hover:border-primary transition-all duration-300"
          >
            <div className="absolute top-0 right-0 text-6xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
              {index + 1}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-lg">{step.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-secondary/30">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">40</h3>
              <p className="text-sm text-muted-foreground">Grammar & Spelling Points</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-accent">30</h3>
              <p className="text-sm text-muted-foreground">Readability & Clarity Points</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">30</h3>
              <p className="text-sm text-muted-foreground">Originality & Value Points</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Score <span className="text-accent font-semibold">70 or above</span> to pass validation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}