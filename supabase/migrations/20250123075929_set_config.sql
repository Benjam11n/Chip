create or replace function set_config(key text, value text)
returns void as $$
begin
  perform set_config(key, value, false);
end;
$$ language plpgsql;