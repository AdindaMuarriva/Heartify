import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import User from "@/models/Users";
import bcrypt from 'bcryptjs'; 

export async function POST(request: NextRequest) {
  console.log("📝 REGISTER API - SIMPLE VERSION");
  
  try {
    const { name, email, password, role = "user", adminCode } = await request.json();
    
    console.log("Data received:", { name, email, role });

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Semua kolom wajib diisi" },
        { status: 400 }
      );
    }

    if (role === "admin" && adminCode !== "ADMIN123") {
      return NextResponse.json(
        { success: false, message: "Kode admin salah" },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("✅ DB connected");

    // Check existing
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // HASH PASSWORD MANUALLY DI SINI
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed:", hashedPassword.substring(0, 20) + "...");

    // Create user dengan password yang sudah di-hash
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword, // Sudah di-hash
      role: role
    });

    await newUser.save();
    console.log("✅ User saved:", newUser.email);

    const userResponse = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      user: userResponse
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ REGISTER ERROR DETAILS:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", error);
    
    // Cek error spesifik mongoose
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Data tidak valid",
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Server error: " + error.message,
        errorType: error.name
      },
      { status: 500 }
    );
  }
}