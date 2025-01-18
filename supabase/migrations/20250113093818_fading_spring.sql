/*
  # Initial Schema for Poker Chip Tracker

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    - `games`
      - `id` (uuid)
      - `created_by` (uuid, references profiles)
      - `name` (text)
      - `status` (text)
      - `initial_buy_in` (numeric)
      - `code` (text)
      - `is_locked` (bool)
      - `max_players` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `players`
      - `id` (uuid)
      - `game_id` (uuid, references games)
      - `user_id` (uuid, references profiles)
      - `position` (integer)
      - `name` (text)
      - `chips_count` (jsonb)
      - `total_buy)in` (numeric)
      - `created_at` (timestamp)
    - `game_settings`
      - `id` (uuid)
      - `game_id` (uuid, references games)
      - `blind_levels` (jsonb)
      - `timer_duration` (integer)
      - `chip_denominations` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    initial_buy_in integer NOT NULL,
    code text NOT NULL UNIQUE,
    is_locked boolean NOT NULL DEFAULT false,
    max_players integer NOT NULL,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  position integer NOT NULL,
  name text NOT NULL,
  stack numeric(10,2) NOT NULL DEFAULT 1000,
  total_buy_in numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(game_id, user_id),
  UNIQUE(game_id, position)
);

-- Create game_settings table
CREATE TABLE IF NOT EXISTS game_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL UNIQUE,
  blind_levels jsonb NOT NULL DEFAULT '[]',
  timer_duration integer NOT NULL DEFAULT 1200,
  chip_denominations jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Games policies
CREATE POLICY "Games are viewable by players"
  ON games
  FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM players
      WHERE players.game_id = games.id
      AND players.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create games"
  ON games
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Game creators can update games"
  ON games
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Players policies
CREATE POLICY "Players are viewable by game participants"
  ON players
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = players.game_id
      AND games.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can join games"
  ON players
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update their own stats"
  ON players
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Game settings policies
CREATE POLICY "Game settings are viewable by players"
  ON game_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_settings.game_id
      AND (
        games.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM players
          WHERE players.game_id = games.id
          AND players.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Game creators can manage settings"
  ON game_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_settings.game_id
      AND games.created_by = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for games table
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();