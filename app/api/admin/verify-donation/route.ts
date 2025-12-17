// app/api/admin/verify-donation/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Donation from "@/models/Donation";
import Campaign from "@/models/Campaign";
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "ID donasi tidak valid." }, { status: 400 });
        }

        await connectDB();
        
        // 1. Cari Donasi
        const donation = await Donation.findById(id);
        
        if (!donation) {
            return NextResponse.json({ success: false, message: "Donasi tidak ditemukan." }, { status: 404 });
        }

        if (donation.status === 'verified') {
            return NextResponse.json({ success: false, message: "Donasi sudah diverifikasi sebelumnya." }, { status: 400 });
        }
        
        // 2. Update status donasi
        const verifiedDonation = await Donation.findByIdAndUpdate(
            id,
            { status: 'verified' },
            { new: true } 
        );
        
        // 3. Update jumlah collected di Campaign terkait
        await Campaign.findByIdAndUpdate(
            donation.campaignId,
            { $inc: { collected: donation.amount } } 
        );

        return NextResponse.json({ success: true, message: "Donasi berhasil diverifikasi dan dana ditambahkan." });

    } catch (error: any) {
        console.error("❌ Error verifying donation:", error);
        return NextResponse.json(
            { success: false, error: "Server error saat memverifikasi donasi." },
            { status: 500 }
        );
    }
}