// Lokasi: app/api/auth/login/route.js (atau sejenisnya)

import pino from 'pino';
import { logSender } from '@/lib/logger'; // Asumsi Anda punya module pengirim log

export async function POST(request) {
  const { email, password } = await request.json();

  // --- 1. Simulasi Validasi Gagal ---
  if (password.length < 6) {
    // Log ini dikirim ke Loki
    logSender.error({
      message: `Login failed: Password too short for user ${email}`,
      level: 'error',
      user_id: 'ANON', // User belum terautentikasi
      endpoint: '/api/auth/login',
      error_code: 400,
      ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1'
    });
    
    return new Response(JSON.stringify({ message: 'Invalid credentials or password too short' }), { status: 400 });
  }

  // --- 2. Simulasi Login Berhasil ---
  // ... (Log info jika berhasil)

  return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
}