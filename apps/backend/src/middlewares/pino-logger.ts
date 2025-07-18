import fs from "node:fs";
import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

export function customLogger() {
  const logFilePath = "/tmp/logs.txt";
  const fileStream = fs.createWriteStream(logFilePath, { flags: "a" });

  const prettyStream = pretty({
    colorize: true,
    destination: fileStream,
    mkdir: true,
    minimumLevel: "warn",
  });

  const prettyLog = pretty({
    colorize: true,
  });

  return pinoLogger({
    pino: pino(
      {
        level: process.env.LOG_LEVEL || "info",
      },
      pino.multistream([prettyStream, prettyLog]),
    ),
  });
}
