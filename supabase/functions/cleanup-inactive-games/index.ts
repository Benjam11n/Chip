import { serve } from "https://deno.land/std@0.170.0/http/server.ts"
import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'

interface Env {
  CRON_KEY: string;
  POSTGRES_URL: string;
}

interface Request {
  headers: Headers;
}

serve(async (req: Request): Promise<Response> => {
  try {
    // Verify the request is a scheduled CRON
    const authHeader: string | null = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${(Deno.env.toObject() as Env).CRON_KEY}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Connect directly to the database
    const databaseUrl: string = (Deno.env.toObject() as Env).POSTGRES_URL;
    const pool = new postgres.Pool(databaseUrl, 3, true);
    const connection = await pool.connect();
    
    try {
      const result = await connection.queryObject`
        SELECT cleanup_inactive_games();
      `;
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});