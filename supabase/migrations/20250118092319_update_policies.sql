-- First drop all existing policies
DROP POLICY IF EXISTS "Games are viewable by players" ON games;
DROP POLICY IF EXISTS "Players can update their own stats" ON players;
DROP POLICY IF EXISTS "Game creators can update games" ON games;
DROP POLICY IF EXISTS "Users can create games" ON games;

DROP POLICY IF EXISTS "Players are viewable by game participants" ON players;
DROP POLICY IF EXISTS "Users can join games" ON players;
DROP POLICY IF EXISTS "Players select policy" ON players;
DROP POLICY IF EXISTS "Players insert policy" ON players;
DROP POLICY IF EXISTS "Players update policy" ON players;

-- Create new permissive policies for players
CREATE POLICY "Anyone can view players"
  ON players
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join games"
  ON players
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Players update policy"
  ON players
  FOR UPDATE
  USING (true);

-- Game policies
CREATE POLICY "Anyone can view games"
  ON games
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create games"
  ON games
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Games update policy"
  ON games
  FOR UPDATE
  USING (created_by = auth.uid() OR created_by IS NULL);
