import winston from 'winston';

// 1. Konfigurasi Logger Sederhana (Hanya ke Console)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'heartify-app' },
  transports: [
    // Output ke Terminal VS Code saja (Aman & Tidak Error)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// 2. Fungsi Wrapper 'sendLog'
// Kita tetap pertahankan fungsi ini agar file API Login/Register TIDAK ERROR
export const sendLog = async (
  level: 'info' | 'warn' | 'warning' | 'error', 
  message: string, 
  meta: any = {}
) => {
  // Winston pakai 'warn', tapi API kamu pakai 'warning', kita samakan
  const validLevel = level === 'warning' ? 'warn' : level;

  logger.log({
    level: validLevel,
    message: message,
    ...meta 
  });
};

export default logger;