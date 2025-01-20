import { Cron } from 'https://deno.land/x/croner@7.3.1/dist/croner.js';

// Run every hour
new Cron('0 * * * *', () => {
  console.log('Running cleanup of inactive games...');
  fetch('https://YOUR_PROJECT_REF.functions.supabase.co/cleanup-inactive-games', {
    method: 'POST'
  });
});