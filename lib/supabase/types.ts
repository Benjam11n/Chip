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
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          created_by: string
          name: string
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          name: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          name?: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          game_id: string
          user_id: string
          position: number
          chips_count: Json
          total_buyin: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          position: number
          chips_count?: Json
          total_buyin?: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          position?: number
          chips_count?: Json
          total_buyin?: number
          created_at?: string
        }
      }
      game_settings: {
        Row: {
          id: string
          game_id: string
          blind_levels: Json
          timer_duration: number
          chip_denominations: Json
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          blind_levels?: Json
          timer_duration?: number
          chip_denominations?: Json
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          blind_levels?: Json
          timer_duration?: number
          chip_denominations?: Json
          created_at?: string
        }
      }
      game_rounds: {
        Row: {
          id: string
          game_id: string
          round_number: number
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          round_number: number
          status: 'active' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          round_number?: number
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      game_actions: {
        Row: {
          id: string
          round_id: string
          player_id: string
          action_type: 'bet' | 'call' | 'raise' | 'fold' | 'check'
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          round_id: string
          player_id: string
          action_type: 'bet' | 'call' | 'raise' | 'fold' | 'check'
          amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          round_id?: string
          player_id?: string
          action_type?: 'bet' | 'call' | 'raise' | 'fold' | 'check'
          amount?: number
          created_at?: string
        }
      }
      game_pots: {
        Row: {
          id: string
          round_id: string
          amount: number
          winner_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          round_id: string
          amount: number
          winner_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          round_id?: string
          amount?: number
          winner_id?: string | null
          created_at?: string
        }
      }
    }
  }
}