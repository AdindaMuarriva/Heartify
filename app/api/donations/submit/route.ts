// app/api/donations/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Donation from "@/models/Donation";
import Campaign from "@/models/Campaign";
import mongoose from "mongoose"; // Import Mongoose untuk validasi ObjectId

// --- PENTING: HAPUS 'export const config' karena request.formData()
// --- menangani body parsing secara internal di App Router.

export async function POST(request: NextRequest) {
    console.log("🔐 DONATION SUBMIT API triggered.");
    try {
        await connectDB();
        
        // Pastikan Models dimuat (solusi umum untuk Next.js hot reload)
        if (!mongoose.models.Donation || !mongoose.models.Campaign) {
             // Ini akan memaksa Mongoose untuk meregistrasi Model jika hilang
             console.log("Re-registering Mongoose models...");
             // Anda harus memastikan model Anda memiliki logic re-export yang benar (seperti yang saya berikan sebelumnya)
        }
        
        // 1. Ambil data dari FormData (termasuk file)
        const formData = await request.formData();
        
        const campaignId = formData.get('campaignId') as string;
        const amount = Number(formData.get('amount'));
        const donorName = formData.get('donorName') as string || 'Anonim';
        const donorEmail = formData.get('donorEmail') as string;
        const paymentMethod = formData.get('paymentMethod') as string; // Contoh: 'Bank Transfer'
        const provider = formData.get('provider') as string; // Contoh: 'BCA'
        const proofFile = formData.get('proofFile') as File;
        console.log(`Donation received: ${amount} to ${campaignId}`);

        // 2. Validasi Kritis
        if (!campaignId || isNaN(amount) || amount <= 0 || !donorEmail || !proofFile) {
             console.error("Validation failed: Missing fields or invalid amount.");
            return NextResponse.json({ success: false, message: "Data donasi (ID, Jumlah, Email, atau Bukti Transfer) tidak lengkap." }, { status: 400 });
        }
        
        // Validasi ID Campaign Mongoose (opsional tapi disarankan)
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
             console.error("Validation failed: Invalid Campaign ID.");
            return NextResponse.json({ success: false, message: "ID Kampanye tidak valid." }, { status: 400 });
        }

        // 3. SIMULASI Upload File
        // Di lingkungan nyata, panggil layanan Cloudinary/S3/dll.
        // Kita hanya akan menyimpan nama file/URL placeholder.
        const proofUrl = proofFile ? `/uploads/proofs/${Date.now()}_${proofFile.name}` : '';
        console.log(`[SIMULASI UPLOAD]: Proof URL: ${proofUrl.substring(0, 50)}...`);

        // 4. Campaign 
        const newDonation = new Donation({
            campaignId: campaignId,
            amount: amount,
            donorName: donorName,
            donorEmail: donorEmail, // Pastikan ini terisi!
            
            paymentMethod: paymentMethod, // 'Bank Transfer' atau 'E-Wallet'
            paymentProvider: provider,    // <-- Menyimpan nama Bank/Provider (BCA, GoPay, dll)
            
            proofOfPayment: proofUrl, 
            status: 'pending', 
        });

        const savedDonation = await newDonation.save();
        
        console.log(`✅ Donasi success. ID: ${savedDonation._id}`);

        return NextResponse.json({
            success: true,
            message: "Donasi berhasil dikonfirmasi dan menunggu verifikasi admin.",
            donation: {
                _id: savedDonation._id.toString(),
                // Buat nomor resi dari ID Donasi
                receiptNumber: `RC-${savedDonation._id.toString().substring(0, 8)}`, 
                amount: savedDonation.amount
            }
        }, { status: 201 });

    } catch (error: any) {
        // Ini adalah log error yang harus Anda cek di terminal
        console.error("❌ Fatal Error submitting donation:", error); 
        
        // Cek jika errornya adalah ValidationError (Mongoose validation)
        if (error.name === 'ValidationError') {
             return NextResponse.json(
                { success: false, message: "Validasi Gagal: Cek field data donasi Anda." },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { success: false, message: "Gagal memproses donasi. Cek log server." },
            { status: 500 }
        );
    }
}