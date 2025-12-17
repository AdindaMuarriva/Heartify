import mongoose from "mongoose";

// Ambil URI
const MONGODB_URI = process.env.MONGODB_URI; 

// 1. Validasi Ketat
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined. Please check your .env file.");
}

// 2. Definisi Cache yang Lebih Aman untuk TypeScript
interface MongooseCache {
  conn: any | null;
  promise: Promise<any> | null;
}

let cached: MongooseCache = (global as any).mongoose;

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
        console.log("⏳ MongoDB: Starting initial connection...");
        
        // 3. Gunakan asersi 'as string' agar TypeScript yakin variabel ini tidak undefined
        cached.promise = mongoose.connect(MONGODB_URI as string).then((mongooseInstance) => {
            console.log("🎉 MongoDB: Initial connection successful!");
            return mongooseInstance;
        }).catch((error) => {
            console.error("❌ MongoDB: Connection FAILED!", error.message);
            cached.promise = null; 
            throw error;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}