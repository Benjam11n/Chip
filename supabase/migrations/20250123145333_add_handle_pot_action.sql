-- Create this function in your database
CREATE OR REPLACE FUNCTION handle_pot_action(
  p_player_id UUID,
  p_game_id UUID,
  p_amount INTEGER,
  p_action_type TEXT
)
RETURNS void AS $$
BEGIN
  -- Update player stack
  UPDATE players 
  SET stack = CASE 
    WHEN p_action_type = 'add' THEN stack - p_amount
    ELSE stack + p_amount
  END
  WHERE id = p_player_id;

  -- Update game pot
  UPDATE games 
  SET pot = CASE 
    WHEN p_action_type = 'add' THEN pot + p_amount
    ELSE pot - p_amount
  END
  WHERE id = p_game_id;

  -- Insert action record
  INSERT INTO game_actions (player_id, game_id, action_type, amount)
  VALUES (p_player_id, p_game_id, p_action_type, p_amount);
END;
$$ LANGUAGE plpgsql;