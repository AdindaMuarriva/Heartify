import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/Users"; 

export async function GET(request: NextRequest) {
    console.log("Fetching all users for admin dashboard...");
    try {
        await connectDB();
        
        // Mengambil SEMUA user, dan secara eksplisit menghilangkan field 'password'
        const users = await User.find({})
            .select('-password') 
            .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

        console.log(`✅ Successfully fetched ${users.length} users.`);
        
        return NextResponse.json(users);
        
    } catch (error: any) {
        console.error("❌ Error fetching all users:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data pengguna.", error: error.message },
            { status: 500 }
        );
    }
}