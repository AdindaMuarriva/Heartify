// app/api/admin/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "ID campaign tidak valid." }, { status: 400 });
        }

        await connectDB();
        
        const result = await Campaign.findByIdAndUpdate(
            id,
            { status: 'rejected' },
            { new: true } 
        );

        if (!result) {
            return NextResponse.json({ success: false, error: "Campaign tidak ditemukan." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Campaign berhasil ditolak." });

    } catch (error: any) {
        console.error("❌ Error rejecting campaign:", error);
        return NextResponse.json(
            { success: false, error: "Server error saat menolak kampanye." },
            { status: 500 }
        );
    }
}