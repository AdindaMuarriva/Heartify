import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/Users";
import bcrypt from 'bcryptjs'; // Import bcrypt

export async function POST(request: NextRequest) {
  console.log("🔐 LOGIN API - SIMPLE VERSION (clean)");

  try {
    const { email, password } = await request.json();
    console.log("Login for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { success: false, message: "Email belum terdaftar" },
        { status: 404 }
      );
    }

    console.log("User found:", user.email);
    console.log("Stored hash exists:", !!user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match?", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return NextResponse.json(
        { success: false, message: "Password salah" },
        { status: 401 }
      );
    }

    console.log("✅ Login successful!");

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
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error: " + error.message
      },
      { status: 500 }
    );
  }
}