export interface Player {
  id: string;
  name: string;
  stack: number;
  position: number;
}

export type MoneyAction = 'add' | 'remove';

export interface MoveHistory {
  id: string;
  playerId: string;
  timestamp: number;
  type: 'money';
  moneyAction: MoneyAction;
  amount: number;
}

export type Game = {
  id: string;
  name: string;
  code: string;
  initial_buy_in: number;
  maxPlayers: number;
  isLocked: boolean;
  status: 'active' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  players: Player[];
};

export interface GameState {
  id: string;
  players: Player[];
  pot: number;
  moves: MoveHistory[];
  initialBuyIn: number;
}