'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface HandStrength {
  value: number;
  label: string;
  color: string;
}

interface PossibleHand {
  name: string;
  probability: number;
  description: string;
  requiredCards: string[];
}

interface HandAnalysis {
  strength: HandStrength;
  possibleHands: PossibleHand[];
}

interface HandAnalyzerProps {
  cards: string[];
  analysis: HandAnalysis | null;
}

export function HandAnalyzer({ cards, analysis }: HandAnalyzerProps) {
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
        <Progress
          value={analysis.strength.value}
          className={cn("h-2", analysis.strength.color)}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Possible Hands</h3>
        <div className="space-y-3">
          {analysis.possibleHands.map((hand, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{hand.name}</span>
                <span className="text-sm text-muted-foreground">
                  {hand.probability.toFixed(1)}% chance
                </span>
              </div>
              <Progress
                value={hand.probability}
                className={cn(
                  "h-1.5",
                  hand.probability > 10 ? "bg-green-500" :
                  hand.probability > 5 ? "bg-yellow-500" :
                  "bg-orange-500"
                )}
              />
              <p className="text-sm text-muted-foreground">{hand.description}</p>
              {hand.requiredCards.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {hand.requiredCards.map((card, i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-block px-1.5 py-0.5 text-sm font-mono rounded border",
                        card.includes('♥') || card.includes('♦') ? "text-red-500" : "text-black"
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