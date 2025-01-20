export interface Player {
  id: string;
  name: string;
  stack: number;
}

export interface MoveHistory {
  id: string;
  player_id: string;
  created_at: number;
  action_type: 'add' | 'remove';
  amount: number;
}

export interface MoveHistoryView {
  id: string;
  playerId: string;
  createdAt: number;
  action_type: 'add' | 'remove';
  amount: number;
}

export type Game = {
  id: string;
  name: string;
  code: string;
  pot: number;
  initial_buy_in: number;
  max_players: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  players: Player[];
};

export interface GameState {
  id: string;
  name: string;
  code: string;
  players: Player[];
  pot: number;
  moves: MoveHistoryView[];
  initialBuyIn: number;
}

export type GameView = {
  id: string;
  name: string;
  code: string;
  pot: number;
  initial_buy_in: number;
  game_actions: MoveHistory[];
  max_players: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  players: Player[];
};