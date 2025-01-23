DROP POLICY IF EXISTS "Players within the same game can delete game" ON games;
CREATE POLICY "Anyone can delete games" ON games FOR DELETE USING (true);

DROP POLICY IF EXISTS "Delete players within the same game" ON players;
CREATE POLICY "Anyone can delete players from games" ON players FOR DELETE USING (true);