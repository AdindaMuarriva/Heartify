// models/Donation.ts - KODE FINAL DAN TERSTRUKTUR
import mongoose, { Schema, Document, Types } from "mongoose";

// Interface untuk tipe data Donation (opsional tapi disarankan)
export interface IDonation extends Document {
    campaignId: Types.ObjectId;
    amount: number;
    donorName: string;
    donorEmail: string;
    message?: string;
    
    // Perhatikan: paymentMethod dan paymentProvider ditambahkan
    paymentMethod: 'Bank Transfer' | 'E-Wallet' | 'Gopay' | 'OVO' | string; 
    paymentProvider: string;
    
    status: 'pending' | 'verified' | 'failed';
    transactionId?: string;
    proofOfPayment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const DonationSchema: Schema = new mongoose.Schema(
    {
        // Reference ke Campaign yang didukung
        campaignId: { 
            type: Schema.Types.ObjectId, 
            ref: "Campaign", 
            required: true 
        },

        // Jumlah Donasi
        amount: { 
            type: Number, 
            required: true, 
            min: 1000 // Minimal donasi
        },

        // Informasi Donatur
        donorName: { 
            type: String, 
            default: "Anonim" 
        },
        donorEmail: { 
            type: String, 
            required: true 
        },
        message: { 
            type: String, 
            maxlength: 500 
        },

        // Detail Pembayaran (Digabungkan dan Diperbaiki)
        paymentMethod: { 
            type: String, 
            required: true,
            // Enum harus mencakup semua kategori utama yang dikirim dari frontend:
            enum: ["Bank Transfer", "E-Wallet"] 
        },
        paymentProvider: { // <-- FIELD BARU untuk nama bank/provider (BCA, GoPay, dll)
             type: String,
             default: 'Internal', 
             required: true 
        },
        
        // Status & Bukti
        status: {
            type: String,
            enum: ["pending", "verified", "failed"],
            default: "pending", 
        },
        transactionId: { 
            type: String 
        },
        proofOfPayment: { 
            type: String 
        },
    },
    { timestamps: true }
);

// Mencegah model didefinisikan ulang di Next.js hot reload
export default mongoose.models.Donation 
    ? (mongoose.models.Donation as mongoose.Model<IDonation>)
    : mongoose.model<IDonation>("Donation", DonationSchema);