// app/api/campaign/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign"; 
// Asumsi Anda memiliki model Campaign di "@/models/Campaign"

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        // Mengambil SEMUA campaign, tanpa filter status
        const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
        
        // Catatan: Di sini kita mengembalikan objek Mongoose penuh 
        // agar logika filter di frontend AdminDashboard berjalan
        return NextResponse.json(campaigns);
        
    } catch (error: any) {
        console.error("Error fetching all campaigns for admin:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil semua data kampanye.", error: error.message },
            { status: 500 }
        );
    }
}