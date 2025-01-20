'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HandAnalysis } from '@/lib/poker/analysis';
import { cn } from '@/lib/utils';

interface HandAnalyzerProps {
  analysis: HandAnalysis | null;
}

export function HandAnalyzer({ analysis }: HandAnalyzerProps) {
  if (!analysis) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          Select two cards to see analysis
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
        <Progress value={analysis.strength.value * 25} className="h-2" />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Possible Hands</h3>
        <div className="space-y-3">
          {analysis.possibleHands.map((hand, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span
                  className={cn(
                    'font-medium',
                    hand.completed ? 'text-primary font-bold' : ''
                  )}
                >
                  {hand.name}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {hand.description}
              </p>
              {hand.requiredCards.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {hand.requiredCards.map((card, i) => (
                    <span
                      key={i}
                      className={cn(
                        'inline-block px-1.5 py-0.5 text-sm font-mono rounded border',
                        card.includes('♥') || card.includes('♦')
                          ? 'text-primary'
                          : ''
                      )}
                    >
                      {card}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
