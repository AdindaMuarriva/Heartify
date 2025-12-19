import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Laporan from "@/models/Laporan";

// GET: Mengambil semua laporan tersalurkan
export async function GET() {
  try {
    await connectDB();
    const reports = await Laporan.find({}).sort({ completionDate: -1 });
    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Menyimpan laporan baru (Hanya untuk Admin)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Simpan ke database
    const newReport = await Laporan.create(body);
    
    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}