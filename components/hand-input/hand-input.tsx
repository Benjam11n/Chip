'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy } from 'lucide-react';
import { CardSelector } from './card-selector';
import { HandAnalyzer } from './hand-analyzer';
import { analyzeHand } from '@/lib/poker/analysis';
import { toast } from 'sonner';

export function HandInput() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleCardSelect = (card: string) => {
    setSelectedCards((prev) => {
      if (prev.includes(card)) {
        return prev.filter((c) => c !== card);
      }
      if (prev.length < 2) {
        return [...prev, card];
      }
      return prev;
    });
  };

  const analysis =
    selectedCards.length === 2 ? analyzeHand(selectedCards) : null;

  const shareUrl =
    selectedCards.length === 2
      ? `${window.location.origin}/analyze/${selectedCards.join('-')}`
      : null;

  const handleShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Poker Hand Analysis',
          text: `Check out this poker hand analysis: ${selectedCards.join(
            ' '
          )}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    toast('Link copied', {
      description: 'Analysis link copied to clipboard',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CardSelector
            selectedCards={selectedCards}
            onSelectCard={handleCardSelect}
          />

          {selectedCards.length === 2 && (
            <Card className="p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Analysis
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </Card>
          )}
        </div>

        <HandAnalyzer cards={selectedCards} analysis={analysis} />
      </div>
    </div>
  );
}
