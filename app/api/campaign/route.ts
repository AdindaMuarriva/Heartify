import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await connectDB();
    const data = await Campaign.find();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
