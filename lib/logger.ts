import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "logs/heartify.log");

// Pastikan folder logs ada
if (!fs.existsSync(path.dirname(logFile))) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
}

export const logger = {
  info: async (message: string, meta: any = {}) => {
    const log = {
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      ...meta,
    };
    fs.appendFileSync(logFile, JSON.stringify(log) + "\n");
    console.log(log);
  },
  warning: async (message: string, meta: any = {}) => {
    const log = {
      timestamp: new Date().toISOString(),
      level: "warning",
      message,
      ...meta,
    };
    fs.appendFileSync(logFile, JSON.stringify(log) + "\n");
    console.warn(log);
  },
  error: async (message: string, meta: any = {}) => {
    const log = {
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      ...meta,
    };
    fs.appendFileSync(logFile, JSON.stringify(log) + "\n");
    console.error(log);
  },
};
