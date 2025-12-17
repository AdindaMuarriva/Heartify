// app/api/campaign/pending/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        // Hanya mengambil campaign dengan status 'pending'
        const pendingCampaigns = await Campaign.find({ status: 'pending' }).sort({ createdAt: 1 });
        
        return NextResponse.json(pendingCampaigns);
        
    } catch (error: any) {
        console.error("❌ Error fetching pending campaigns:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data kampanye pending.", error: error.message },
            { status: 500 }
        );
    }
}