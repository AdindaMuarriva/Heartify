import winston from 'winston';
import LokiTransport from 'winston-loki';

// 1. Konfigurasi Logger Utama
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'heartify-app' }, // Label default
  transports: [
    // Output ke Terminal VS Code (Warna-warni biar enak dibaca)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Output ke Grafana Loki (Pastikan Docker jalan)
    new LokiTransport({
      host: 'http://127.0.0.1:3100', // Sesuai settingan Docker Compose tadi
      json: true,
      labels: { job: 'heartify-logs' },
      onConnectionError: (err: any ) => {
        console.error("⚠️ Gagal kirim log ke Loki (Cek Docker):", err.message);
      }
    }),
  ],
});

// 2. Fungsi Wrapper 'sendLog' (INI YANG HILANG SEBELUMNYA)
// Fungsi ini menjembatani cara panggil kamu di API dengan winston
export const sendLog = async (
  level: 'info' | 'warn' | 'warning' | 'error', 
  message: string, 
  meta: any = {}
) => {
  // Winston pakai 'warn', tapi kadang kita terbiasa ketik 'warning'
  const validLevel = level === 'warning' ? 'warn' : level;

  logger.log({
    level: validLevel,
    message: message,
    ...meta // Data tambahan (email, error stack, dll)
  });
};

export default logger;