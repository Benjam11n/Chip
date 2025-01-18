/*
  # Add Game History Tables

  1. New Tables
    - `game_rounds` - Track poker rounds/hands
      - `id` (uuid, primary key)
      - `game_id` (uuid, foreign key)
      - `round_number` (integer)
      - `status` (text)
      - `created_at` (timestamp)
    - `game_actions` - Record player actions
      - `id` (uuid, primary key)
      - `round_id` (uuid, foreign key)
      - `player_id` (uuid, foreign key)
      - `action_type` (text)
      - `amount` (numeric)
      - `created_at` (timestamp)
    - `game_pots` - Track pot sizes and winners
      - `id` (uuid, primary key)
      - `round_id` (uuid, foreign key)
      - `amount` (numeric)
      - `winner_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for game participants
*/

-- Create game_rounds table
CREATE TABLE IF NOT EXISTS game_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  round_number integer NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(game_id, round_number)
);

-- Create game_actions table
CREATE TABLE IF NOT EXISTS game_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('bet', 'call', 'raise', 'fold', 'check')),
  amount numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create game_pots table
CREATE TABLE IF NOT EXISTS game_pots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  winner_id uuid REFERENCES players(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_pots ENABLE ROW LEVEL SECURITY;

-- Game rounds policies
CREATE POLICY "Game rounds are viewable by players"
  ON game_rounds
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_rounds.game_id
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

CREATE POLICY "Game creators can manage rounds"
  ON game_rounds
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_rounds.game_id
      AND games.created_by = auth.uid()
    )
  );

-- Game actions policies
CREATE POLICY "Game actions are viewable by players"
  ON game_actions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_rounds
      JOIN games ON games.id = game_rounds.game_id
      WHERE game_rounds.id = game_actions.round_id
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

CREATE POLICY "Players can record their own actions"
  ON game_actions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = game_actions.player_id
      AND players.user_id = auth.uid()
    )
  );

-- Game pots policies
CREATE POLICY "Game pots are viewable by players"
  ON game_pots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_rounds
      JOIN games ON games.id = game_rounds.game_id
      WHERE game_rounds.id = game_pots.round_id
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

CREATE POLICY "Game creators can manage pots"
  ON game_pots
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM game_rounds
      JOIN games ON games.id = game_rounds.game_id
      WHERE game_rounds.id = game_pots.round_id
      AND games.created_by = auth.uid()
    )
  );