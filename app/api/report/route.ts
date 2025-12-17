import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await connectDB();

    const laporan = await Campaign.find({
      status: "completed",
    }).sort({ completionDate: -1 });

    return NextResponse.json(laporan);
  } catch (error) {
    console.error("API LAPORAN ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil laporan" },
      { status: 500 }
    );
  }
}
