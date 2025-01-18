'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HandStrength {
  value: number;
  label: string;
  color: string;
}

interface HandAnalysis {
  strength: HandStrength;
  position: string;
  recommendations: string[];
  factors: Array<{
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
}

interface HandAnalyzerProps {
  cards: string[];
  position: string | null;
  stackSize: number;
  analysis: HandAnalysis | null;
}

export function HandAnalyzer({ cards, position, stackSize, analysis }: HandAnalyzerProps) {
  if (!analysis) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          Select cards and position to see analysis
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Hand Strength</h3>
          <span className="text-sm font-medium">{analysis.strength.label}</span>
        </div>
        <Progress
          value={analysis.strength.value}
          className={cn("h-2", analysis.strength.color)}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Recommendations</h3>
        <ul className="space-y-1 text-sm">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="list-disc ml-4">{rec}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Key Factors</h3>
        <div className="space-y-2">
          {analysis.factors.map((factor, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className={cn(
                "w-2 h-2 mt-1.5 rounded-full",
                factor.impact === 'positive' && "bg-green-500",
                factor.impact === 'negative' && "bg-red-500",
                factor.impact === 'neutral' && "bg-yellow-500"
              )} />
              <div>
                <div className="font-medium">{factor.name}</div>
                <p className="text-sm text-muted-foreground">{factor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}