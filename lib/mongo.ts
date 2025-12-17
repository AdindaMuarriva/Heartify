// lib/mongo.ts (DIJAMIN BEBAS DUPLIKASI)
import mongoose from "mongoose";

// Ambil MONGODB_URI, pastikan itu string
const MONGODB_URI: string | undefined = process.env.MONGODB_URI; 

// Cek keberadaan variabel
if (!MONGODB_URI) {
    // Ini akan terdeteksi di server log jika .env belum dimuat
    console.error("FATAL ERROR: MONGODB_URI is not defined!");
    throw new Error("MONGODB_URI is not defined. Please check your .env.local file.");
}

// Gunakan cache global untuk menghindari koneksi berulang di Development
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null,
    };
}

export default async function connectDB() {
    if (cached.conn) {
        console.log("✅ MongoDB: Connection reused (cached).");
        return cached.conn;
    }

    if (!cached.promise) {
        // Log saat mencoba koneksi pertama kali
        console.log("⏳ MongoDB: Starting initial connection...");
        
        // Mulai koneksi
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            console.log("🎉 MongoDB: Initial connection successful!");
            return mongoose;
        }).catch((error) => {
            console.error("❌ MongoDB: Connection FAILED!", error.message);
            // Reset promise agar bisa mencoba lagi
            cached.promise = null; 
            throw error; // Re-throw error untuk menghentikan API
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}