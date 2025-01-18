'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const POSITIONS = [
  { id: 'UTG', label: 'UTG', description: 'Under the Gun' },
  { id: 'MP', label: 'MP', description: 'Middle Position' },
  { id: 'CO', label: 'CO', description: 'Cut Off' },
  { id: 'BTN', label: 'BTN', description: 'Button' },
  { id: 'SB', label: 'SB', description: 'Small Blind' },
  { id: 'BB', label: 'BB', description: 'Big Blind' },
] as const;

interface PositionSelectorProps {
  selectedPosition: string | null;
  onSelectPosition: (position: string) => void;
}

export function PositionSelector({ selectedPosition, onSelectPosition }: PositionSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {POSITIONS.map(({ id, label, description }) => (
        <Button
          key={id}
          variant={selectedPosition === id ? "default" : "outline"}
          className={cn(
            "flex flex-col items-center p-2 h-auto",
            selectedPosition === id && "ring-2 ring-primary"
          )}
          onClick={() => onSelectPosition(id)}
        >
          <span className="text-lg font-bold">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </Button>
      ))}
    </div>
  );
}