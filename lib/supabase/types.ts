export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          created_by: string
          name: string
          created_at: string
          updated_at: string
          pot: number;
          initial_buy_in: number
          code: string
          max_players: number
          is_locked: boolean
        }
        Insert: {
          id?: string
          created_by: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          game_id: string
          user_id: string
          chips_count: Json
          total_buyin: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          chips_count?: Json
          total_buyin?: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          chips_count?: Json
          total_buyin?: number
          created_at?: string
        }
      }
      game_actions: {
        Row: {
          id: string
          player_id: string,
          game_id: string
          action_type: 'add' | 'remove'
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          action_type: 'bet' | 'call' | 'raise' | 'fold' | 'check'
          amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          action_type?: 'bet' | 'call' | 'raise' | 'fold' | 'check'
          amount?: number
          created_at?: string
        }
      }
    }
  }
}