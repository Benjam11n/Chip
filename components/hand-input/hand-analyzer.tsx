'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { HandAnalysis } from '@/lib/poker/analysis';
import { cn } from '@/lib/utils';

interface HandAnalyzerProps {
  analysis: HandAnalysis | null;
}

export const HandAnalyzer = ({ analysis }: Readonly<HandAnalyzerProps>) => {
  if (!analysis) {
    return (
      <Card className="p-4">
        <div className="text-muted-foreground text-center">Select two cards to see analysis</div>
      </Card>
    );
  }

  return (
    <Card className="space-y-6 p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Hand Strength</h3>
          <span className="text-sm font-medium">{analysis.strength.label}</span>
        </div>
        <Progress value={analysis.strength.value * 25} className="h-2" />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Possible Hands</h3>
        <div className="space-y-3">
          {analysis.possibleHands.map((hand) => (
            <div key={hand.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={cn('font-medium', hand.completed ? 'text-primary font-bold' : '')}>
                  {hand.name}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{hand.description}</p>
              {hand.requiredCards.length > 0 && (
                <div className="mt-1 flex gap-1">
                  {hand.requiredCards.map((card) => (
                    <span
                      key={card}
                      className={cn(
                        'inline-block rounded border px-1.5 py-0.5 font-mono text-sm',
                        card.includes('♥') || card.includes('♦') ? 'text-primary' : '',
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
