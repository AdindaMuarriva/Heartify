import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await connectDB();

    await Campaign.deleteMany();

    await Campaign.insertMany([
    {
        title: "Pembangunan Sekolah Anak Desa",
        category: "Pendidikan",
        target: 50000000,
        beneficiary: "Anak-anak Desa Harapan",
        deadline: new Date("2025-12-31"),
        image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350",
        description:
        "Kampanye ini bertujuan untuk membangun sekolah layak bagi anak-anak desa agar mendapatkan pendidikan yang lebih baik.",
    },
    {
        title: "Bantuan Kesehatan Ibu dan Anak",
        category: "Kesehatan",
        target: 30000000,
        beneficiary: "Ibu dan Anak",
        deadline: new Date("2025-10-30"),
        image:
        "https://images.unsplash.com/photo-1580281657527-47d0b0f08e1e",
        description:
        "Membantu biaya pengobatan dan pemeriksaan kesehatan bagi ibu dan anak yang membutuhkan.",
    },
    ]);

    return NextResponse.json({ message: "Seed berhasil" });
  } catch (error) {
  console.error("SEED ERROR:", error);

  return NextResponse.json(
    {
      error: "Seed gagal",
      detail: String(error),
    },
    { status: 500 }
  );
 }
}
