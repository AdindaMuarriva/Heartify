// app/api/profile/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/Users"; 
import bcrypt from "bcryptjs";
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        
        const {
            _id, // Wajib: ID pengguna yang akan diubah
            name,
            email,
            phone,
            bio,
            photo,
            oldPass,
            newPass,
            confirmPass
        } = body;

        // 1. Validasi ID Pengguna
        if (!_id || !Types.ObjectId.isValid(_id)) {
            return NextResponse.json({ success: false, message: "ID pengguna tidak valid." }, { status: 400 });
        }
        
        const userToUpdate = await User.findById(_id);

        if (!userToUpdate) {
            return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
        }

        // 2. Update Data Non-Password
        userToUpdate.name = name;
        userToUpdate.email = email;
        userToUpdate.phone = phone; 
        userToUpdate.bio = bio;     
        userToUpdate.photo = photo; 

        // 3. Logika Perubahan Password
        if (newPass) {
            if (!oldPass) {
                return NextResponse.json({ success: false, message: "Masukkan password lama untuk mengubah password." }, { status: 400 });
            }
            if (newPass !== confirmPass) {
                return NextResponse.json({ success: false, message: "Password baru dan konfirmasi tidak cocok." }, { status: 400 });
            }
            
            // Verifikasi Password Lama
            const isMatch = await bcrypt.compare(oldPass, userToUpdate.password);
            if (!isMatch) {
                return NextResponse.json({ success: false, message: "Password lama tidak cocok." }, { status: 401 });
            }

            // Hash Password Baru dan Simpan
            const salt = await bcrypt.genSalt(10);
            userToUpdate.password = await bcrypt.hash(newPass, salt);
        }

        // 4. Simpan Perubahan ke Database
        const savedUser = await userToUpdate.save();

        // 5. Kembalikan data yang aman
        const safeUser = {
            _id: savedUser._id.toString(),
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
            phone: savedUser.phone || null,
            bio: savedUser.bio || null,
            photo: savedUser.photo || null,
            // JANGAN KEMBALIKAN PASSWORD ATAU HASH
        };

        return NextResponse.json({
            success: true,
            message: "Profil berhasil diperbarui.",
            user: safeUser
        }, { status: 200 });

    } catch (error: any) {
        console.error("❌ API Error updating profile:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memproses pembaruan. Cek log server." },
            { status: 500 }
        );
    }
}