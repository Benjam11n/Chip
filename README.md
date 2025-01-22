# Chip - Virtual Poker Bank

A web application that replaces physical poker chips with digital stack management. Play home poker games without the need for real chips.

## Features

- Digital stack tracking and pot management
- Real-time game state updates
- Hand strength analyzer and poker hand rankings guide
- Multi-player support with room codes
- Automatic cleanup of inactive games

## Tech Stack

- Next.js 15
- Supabase (PostgreSQL, Auth, Realtime)
- TypeScript
- Tailwind CSS
- shadcn/ui

## Local Development

```bash
# Install dependencies
pnpm install

# Start Supabase locally
supabase start

# Start development server
pnpm run dev
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Setup

```bash
# Run migrations
supabase db push

# Reset database (development only)
supabase db reset
```
