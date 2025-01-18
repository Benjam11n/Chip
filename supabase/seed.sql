-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    pot integer NOT NULL DEFAULT 0,
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
    name text NOT NULL,
    stack numeric(10,2) NOT NULL DEFAULT 1000,
    total_buy_in numeric(10,2) NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    UNIQUE(game_id, name)
);

-- Create game_actions table
CREATE TABLE IF NOT EXISTS game_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    game_id uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    action_type text NOT NULL CHECK (action_type IN ('add', 'remove')),
    amount numeric(10,2) DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE game_pots ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Anyone can view games" ON games FOR SELECT USING (true);
CREATE POLICY "Anyone can create games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON games FOR UPDATE USING (true);

CREATE POLICY "Anyone can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Anyone can join games" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON players FOR UPDATE USING (true);
CREATE POLICY "Delete players within the same game"
ON players
FOR DELETE
USING (game_id = current_setting('app.current_game_id')::uuid);

CREATE POLICY "Anyone can view actions" ON game_actions FOR SELECT USING (true);
CREATE POLICY "Anyone can create actions" ON game_actions FOR INSERT WITH CHECK (true);

-- Create updated_at timestamp function and trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
-- Drop existing publication if exists to avoid errors
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Function to set session variables
CREATE OR REPLACE FUNCTION public.set_config(key TEXT, value TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE 'SET ' || key || ' = ''' || value || '''';
END;
$$ LANGUAGE plpgsql;


-- Create new publication
CREATE PUBLICATION supabase_realtime FOR TABLE games, players, game_actions;