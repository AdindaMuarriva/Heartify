// app/api/donations/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Donation from "@/models/Donation"; 
import Campaign from "@/models/Campaign";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        // Mengambil semua riwayat donasi (pending, verified)
        const donationHistory = await Donation.find({})
            .sort({ createdAt: -1 }) // Terbaru di atas
            .populate('campaignId', 'title'); // Optional: Ambil judul campaign untuk display
        
        return NextResponse.json(donationHistory);
        
    } catch (error: any) {
        console.error("❌ Error fetching donations:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data donasi.", error: error.message },
            { status: 500 }
        );
    }
}