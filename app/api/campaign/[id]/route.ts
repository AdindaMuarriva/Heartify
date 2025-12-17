// app/api/campaign/[id]/route.ts - UPDATE
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log("🔄 Fetching campaign with ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return NextResponse.json(
        { error: "Kampanye tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // Handle missing fields dengan default values
    const responseData = {
      _id: campaign._id.toString(),
      title: campaign.title || "Kampanye Tanpa Judul",
      category: campaign.category || "Umum",
      target: campaign.target || 0,
      collected: campaign.collected !== undefined ? campaign.collected : 0,
      beneficiary: campaign.beneficiary || "Penerima Manfaat",
      deadline: campaign.deadline 
        ? new Date(campaign.deadline).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      image: campaign.image || "https://images.unsplash.com/photo-1551836026-d5cbc8397c76",
      description: campaign.description || "Deskripsi kampanye tidak tersedia.",
      admin: campaign.admin || "Heartify",
      location: campaign.location || "Lokasi tidak ditentukan",
      duration: campaign.duration || "Durasi tidak ditentukan",
      details: Array.isArray(campaign.details) ? campaign.details : [],
      impact: Array.isArray(campaign.impact) ? campaign.impact : [],
      status: campaign.status || "pending",
      contactPerson: campaign.contactPerson || "",
      // Tambahan untuk UI
      progress: campaign.target > 0 
        ? Math.min((campaign.collected || 0) / campaign.target * 100, 100)
        : 0
    };
    
    console.log("✅ Campaign found:", responseData.title);
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error("❌ Error fetching campaign:", error);
    return NextResponse.json(
      { 
        error: "Gagal mengambil data kampanye",
        details: error.message 
      },
      { status: 500 }
    );
  }
}