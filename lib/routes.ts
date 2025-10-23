/**
 * Application routes constants
 * Centralized route definitions for better maintainability
 */

export const ROUTES = {
  // Static routes
  HOME: "/",
  CREATE: "/create",
  JOIN: "/join",
  API: {
    GAMES: "/api/games",
  },

  // Dynamic route templates
  GAME_ROOM: (id: string) => `/game/${id}`,
  JOIN_WITH_CODE: (code: string) => `/join/${code}`,
} as const;

// Type exports for route strings
export type RoutePath = typeof ROUTES;
export type GameRoomRoute = ReturnType<typeof ROUTES.GAME_ROOM>;
export type JoinWithCodeRoute = ReturnType<typeof ROUTES.JOIN_WITH_CODE>;
