// app/api/users/count/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/Users";

export async function GET() {
    try {
        await connectDB();
        
        // Menghitung total dokumen di koleksi User
        const count = await User.countDocuments({}); 
        
        return NextResponse.json({ success: true, count: count });
        
    } catch (error: any) {
        console.error("❌ Error fetching user count:", error);
        return NextResponse.json(
            { success: false, message: "Gagal menghitung user.", error: error.message },
            { status: 500 }
        );
    }
}