// utils/logToLoki.js

/**
 * Mengirim log JSON ke Loki.
 * @param {object} logData - Objek log yang berisi level, route, message, dll.
 */
export async function logToLoki(logData) {
    // ⚠️ PENTING: Pastikan LOKI_URL ada di .env.local
    const LOKI_URL = process.env.LOKI_URL; 

    // Jika LOKI_URL tidak ada, hentikan proses
    if (!LOKI_URL) {
        console.warn('LOKI_URL tidak terdefinisi di environment variables. Log tidak terkirim.');
        return;
    }

    // Label yang digunakan Loki untuk indexing dan filtering
    const labels = {
        app: logData.app || 'nextjs-api',
        level: logData.level || 'info',
        route: logData.route || 'unknown',
    };

    const payload = {
        streams: [
            {
                stream: labels,
                values: [
                    // [timestamp_nanoseconds, log_message]
                    [`${Date.now()}000000`, JSON.stringify({
                        message: logData.message,
                        timestamp: new Date().toISOString(),
                    })]
                ]
            }
        ]
    };

    try {
        // 
        const response = await fetch(LOKI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(
                `[LOKI ERROR] Gagal mengirim log. Status: ${response.status}`,
                await response.text()
            );
        } else {
            // Ini akan muncul di Terminal Heartify jika pengiriman berhasil
            console.log(`[LOKI SUCCESS] Log ${logData.level} terkirim.`);
        }

    } catch (error) {
        // Ini akan muncul jika ada masalah jaringan (Firewall/ECONNREFUSED)
        console.error('[LOKI NETWORK ERROR] Gagal terhubung ke Loki (port 3100). Cek Firewall!', error);
    }
}