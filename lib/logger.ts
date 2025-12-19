type LogLevel = "info" | "warning" | "error";

const LOKI_URL = process.env.LOKI_URL!;
const LOKI_USERNAME = process.env.LOKI_USERNAME!;
const LOKI_PASSWORD = process.env.LOKI_PASSWORD!;

function toNanoTimestamp(): string {
  // Date.now() = ms → tambahkan 6 nol agar jadi ns
  return `${Date.now()}000000`;
}

export async function sendLog(
  level: LogLevel,
  message: string,
  extra?: Record<string, any>
) {
  if (!LOKI_URL || !LOKI_USERNAME || !LOKI_PASSWORD) {
    console.warn("Loki env variables not set");
    return;
  }

  const payload = {
    streams: [
      {
        stream: {
          app: "heartify",
          env: process.env.NODE_ENV || "production",
          level,
        },
        values: [
          [
            toNanoTimestamp(),
            JSON.stringify({
              level,
              message,
              ...extra,
            }),
          ],
        ],
      },
    ],
  };

  try {
    await fetch(LOKI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${LOKI_USERNAME}:${LOKI_PASSWORD}`).toString("base64"),
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to send log to Loki:", err);
  }
}
