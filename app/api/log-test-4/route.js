// app/api/log-test-4/route.js
import { NextResponse } from 'next/server';
import { logToLoki } from '@/utils/logToLoki'; 

export async function GET() {
    const timestamp = new Date().toISOString();
    
    try {
        // --- 1. Log Info (Sukses Koneksi) ---
        await logToLoki({
            app: 'nextjs-api',
            route: '/api/log-test-4',
            level: 'info', 
            message: `[TEST 1] Log Info Success: Koneksi berhasil dikirim pada ${timestamp}`
        });

        // --- 2. Log Error (Gagal Kritis) ---
        await logToLoki({
            app: 'nextjs-api',
            route: '/api/log-test-4',
            level: 'error', 
            message: `[TEST 2] Log Error Critical: Kegagalan database simulasi pada ${timestamp}`
        });

        // --- 3. Log Warning (Peringatan) ---
        await logToLoki({
            app: 'nextjs-api',
            route: '/api/log-test-4',
            level: 'warn', 
            message: `[TEST 3] Log Warning: Payload terlalu besar, tetapi berhasil diproses pada ${timestamp}`
        });
        
        // --- 4. Log Debug (Debugging Internal) ---
        await logToLoki({
            app: 'nextjs-api',
            route: '/api/log-test-4',
            level: 'debug', 
            message: `[TEST 4] Log Debugging: Nilai variabel X=123, Y=456`
        });
        
        return NextResponse.json({
            status: 200,
            message: '4 jenis log (info, error, warn, debug) berhasil dikirim ke Loki. Lanjutkan ke verifikasi di Grafana.',
        });

    } catch (error) {
        console.error('Terjadi error saat memproses request:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}