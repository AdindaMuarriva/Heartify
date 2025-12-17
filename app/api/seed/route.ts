import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();

    /* ===============================
       RESET DATA
    =============================== */
    await Campaign.deleteMany();
    await Report.deleteMany();

    /* ===============================
       SEED CAMPAIGN (BERANDA)
    =============================== */
    await Campaign.insertMany([
      {
        title: "Pembangunan Sekolah Anak Desa",
        category: "Pendidikan",
        target: 50000000,
        collected: 17500000,
        beneficiary: "Anak-anak Desa Harapan",
        deadline: new Date("2025-12-31"),
        image:
          "https://images.unsplash.com/photo-1588072432836-e10032774350",
        description:
          "Kampanye ini bertujuan untuk membangun sekolah yang layak bagi anak-anak desa agar mendapatkan pendidikan yang lebih baik.",
      },
      {
        title: "Bantuan Kesehatan Ibu dan Anak",
        category: "Kesehatan",
        target: 30000000,
        collected: 9200000,
        beneficiary: "Ibu dan Anak",
        deadline: new Date("2025-10-30"),
        image:
          "https://images.unsplash.com/photo-1580281657527-47d0b0f08e1e",
        description:
          "Membantu biaya pengobatan dan pemeriksaan kesehatan bagi ibu dan anak yang membutuhkan.",
      },
      {
        title: "Bantuan Korban Bencana Alam",
        category: "Kemanusiaan",
        target: 75000000,
        collected: 38200000,
        beneficiary: "Korban Bencana",
        deadline: new Date("2025-11-15"),
        image:
          "https://images.unsplash.com/photo-1593113598332-cd288d649433",
        description:
          "Menyalurkan bantuan darurat berupa pangan, medis, dan tempat tinggal sementara bagi korban bencana alam.",
      },
    ]);

    /* ===============================
       SEED REPORT (LAPORAN)
    =============================== */
    await Report.insertMany([
      {
        title: "Bantuan Korban Bencana",
        category: "Kemanusiaan",
        amount: 8500000,
        completionDate: "25 Juli 2025",
        image:
          "https://plus.unsplash.com/premium_photo-1695566086196-1cdadbaa1988",
        description:
          "Bantuan darurat telah disalurkan kepada korban bencana alam berupa kebutuhan pokok dan layanan kesehatan.",
        details: [
          "Paket sembako untuk 200 keluarga",
          "Pendirian tenda darurat",
          "Layanan medis dasar",
        ],
        impact: [
          "500 penerima manfaat",
          "Kebutuhan pangan terpenuhi",
        ],
        location: "Kabupaten Cianjur, Jawa Barat",
        beneficiaries: "500 orang",
        duration: "2 minggu",
        admin: "Palang Merah Indonesia",
        contactPerson: "Budi Santoso - 0812-3456-7890",
      },
      {
        title: "Donasi untuk Alat Tulis",
        category: "Pendidikan",
        amount: 3000000,
        completionDate: "18 Juli 2025",
        image:
          "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
        description:
          "Penyaluran perlengkapan sekolah untuk anak-anak di daerah terpencil.",
        details: [
          "150 paket alat tulis",
          "Seragam sekolah",
        ],
        impact: [
          "150 siswa terbantu",
        ],
        location: "Papua",
        beneficiaries: "150 siswa",
        duration: "1 bulan",
        admin: "Yayasan Pendidikan Desa",
        contactPerson: "Sari Dewi - 0813-9876-5432",
      },
      {
        title: "Bantuan Medis Darurat",
        category: "Kesehatan",
        amount: 12000000,
        completionDate: "10 Juli 2025",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
        description:
          "Program bantuan medis untuk pasien tidak mampu yang membutuhkan tindakan darurat.",
        details: [
          "Operasi darurat",
          "Obat-obatan",
        ],
        impact: [
          "15 pasien tertangani",
        ],
        location: "Jakarta",
        beneficiaries: "15 pasien",
        duration: "3 bulan",
        admin: "Yayasan Peduli Kesehatan",
        contactPerson: "dr. Maya Sari - 0811-2233-4455",
      },
    ]);

    return NextResponse.json({
      message: "Seed Campaign & Report BERHASIL",
    });
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
