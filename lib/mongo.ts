import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Validasi sederhana: Jika kosong, langsung stop.
if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is missing in environment variables!");
    // Jangan throw error di sini agar build tidak gagal, 
    // tapi kita beri log yang sangat jelas.
}

interface MongooseCache {
  conn: any | null;
  promise: Promise<any> | null;
}

let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        // Jika MONGODB_URI masih undefined saat fungsi dipanggil, ini akan melempar error yang jelas
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined. Please add it to Vercel Environment Variables.");
        }

        cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}