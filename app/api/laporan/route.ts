import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Laporan from "@/models/Laporan";

export async function GET() {
  try {
    await connectDB();
    
    // Pastikan model sudah ter-import dengan benar
    // Jika koleksi kosong, return array kosong [], jangan biarkan error
    const reports = await Laporan.find({}).sort({ completionDate: -1 }).lean();
    
    return NextResponse.json(reports || []); 
  } catch (error: any) {
    console.error("❌ API Laporan Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat laporan database" }, 
      { status: 500 }
    );
  }
}