-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    position integer NOT NULL,
    name text NOT NULL,
    stack numeric(10,2) NOT NULL DEFAULT 1000,
    total_buy_in numeric(10,2) NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    UNIQUE(game_id, name),
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

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_pots ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Anyone can view games" ON games FOR SELECT USING (true);
CREATE POLICY "Anyone can create games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON games FOR UPDATE USING (true);

CREATE POLICY "Anyone can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Anyone can join games" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON players FOR UPDATE USING (true);

CREATE POLICY "Anyone can view settings" ON game_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update settings" ON game_settings FOR ALL USING (true);

CREATE POLICY "Anyone can view rounds" ON game_rounds FOR SELECT USING (true);
CREATE POLICY "Anyone can manage rounds" ON game_rounds FOR ALL USING (true);

CREATE POLICY "Anyone can view actions" ON game_actions FOR SELECT USING (true);
CREATE POLICY "Anyone can create actions" ON game_actions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view pots" ON game_pots FOR SELECT USING (true);
CREATE POLICY "Anyone can manage pots" ON game_pots FOR ALL USING (true);

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