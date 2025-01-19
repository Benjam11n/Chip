import cron from 'node-cron';

export const startCleanup = () => {
  console.log('Starting cleanup service...'); // Debug log
  
  cron.schedule('* * * * *', async () => { // Run every minute for testing
    console.log('Running cleanup:', new Date().toISOString());
    try {
      await fetch('/api/cron/cleanup');
    } catch (error) {
      console.error('Failed to cleanup games:', error);
    }
  });
};