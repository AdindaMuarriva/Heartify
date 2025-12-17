// app/api/admin/approve-all/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        // Update semua campaign yang statusnya 'pending' menjadi 'approved'
        const result = await Campaign.updateMany(
            { status: 'pending' },
            { status: 'approved' }
        );

        return NextResponse.json({ 
            success: true, 
            message: "Semua kampanye pending berhasil disetujui.", 
            modifiedCount: result.modifiedCount
        });

    } catch (error: any) {
        console.error("❌ Error approving all campaigns:", error);
        return NextResponse.json(
            { success: false, message: "Gagal menyetujui semua kampanye.", error: error.message },
            { status: 500 }
        );
    }
}