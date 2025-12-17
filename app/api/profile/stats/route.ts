// app/api/profile/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Donation from "@/models/Donation";
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId } = await request.json();

        // Validasi ID User
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, message: "ID pengguna tidak valid." }, { status: 400 });
        }

        // Melakukan Agregasi Data dari koleksi Donation
        const aggregateData = await Donation.aggregate([
            { 
                $match: { 
                    userId: new Types.ObjectId(userId), 
                    status: "verified" // Mencari hanya donasi yang sudah diverifikasi admin
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalAmount: { $sum: "$amount" },
                    uniqueCampaigns: { $addToSet: "$campaignId" } 
                }
            }
        ]);

        // Jika tidak ada data, kembalikan nilai 0
        const stats = aggregateData[0] || { totalAmount: 0, uniqueCampaigns: [] };

        return NextResponse.json({
            success: true,
            totalDonated: stats.totalAmount,
            campaignCount: stats.uniqueCampaigns.length,
            points: Math.floor(stats.totalAmount / 10000) // Contoh: 1 poin tiap donasi Rp 10.000
        });

    } catch (error: any) {
        console.error("❌ Stats API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}