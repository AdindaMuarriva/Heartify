// app/api/profile/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/Users";
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId } = await request.json(); // Mengambil ID dari frontend
        
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, message: "ID pengguna tidak valid atau hilang." }, { status: 400 });
        }
        
        const user = await User.findById(userId).select('-password'); // JANGAN KEMBALIKAN PASSWORD

        if (!user) {
            return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
        }
        
        // Kembalikan data user yang aman dan terupdate dari database
        const safeUser = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || null,
            bio: user.bio || null,
            photo: user.photo || null,
        };

        return NextResponse.json({ success: true, user: safeUser });

    } catch (error: any) {
        console.error("❌ API Error fetching user data:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memuat data profil dari server." },
            { status: 500 }
        );
    }
}