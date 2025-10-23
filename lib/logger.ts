import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

export const logger = pino({
  level: isDevelopment ? "debug" : "info",
  transport: isDevelopment && !isTest
    ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    }
    : undefined,
  browser: {
    asObject: true,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
