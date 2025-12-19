import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/Users";
import bcrypt from 'bcryptjs';
import { sendLog } from "@/lib/logger";

export async function POST(request: NextRequest) {
  console.log("🔐 LOGIN API - WITH LOGGING");

  try {
    const { email, password } = await request.json();
    console.log("Login attempt for:", email);

    // Validasi field kosong
    if (!email || !password) {
      await sendLog("warning", "Login gagal: field kosong", {
        email: email || "tidak ada",
      });
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // User tidak ditemukan
    if (!user) {
      console.log("❌ User not found:", email);
      await sendLog("warning", "Login gagal: email tidak terdaftar", {
        email: email,
      });
      return NextResponse.json(
        { success: false, message: "Email belum terdaftar" },
        { status: 404 }
      );
    }

    console.log("✅ User found:", user.email);
    console.log("Stored hash exists:", !!user.password);

    // Debug info lengkap
    console.log("🔍 Debug info:");
    console.log("Input password length:", password.length);
    console.log("Stored hash length:", user.password.length);
    console.log("Hash starts with:", user.password.substring(0, 4));

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    // Password salah
    if (!isMatch) {
      console.log("❌ Password mismatch");
      await sendLog("error", "Login gagal: password salah", {
        email: email,
        inputPasswordLength: password.length,
        hashLength: user.password.length,
      });
      return NextResponse.json(
        { success: false, message: "Password salah" },
        { status: 401 }
      );
    }

    // Login berhasil
    console.log("✅ Login successful!");
    await sendLog("info", "Login berhasil", {
      email: email,
      userId: user._id.toString(),
      role: user.role,
    });

    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: userResponse
    });

  } catch (error: any) {
    console.error("❌ Login error:", error);
    await sendLog("error", "Login error: " + error.message, {
      errorName: error.name,
      errorStack: error.stack,
    });
    return NextResponse.json(
      {
        success: false,
        message: "Server error: " + error.message
      },
      { status: 500 }
    );
  }
}