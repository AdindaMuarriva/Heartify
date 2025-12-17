// app/api/campaign/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Campaign from "@/models/Campaign";

// --- METHOD POST: Mengajukan Kampanye Baru ---
export async function POST(request: NextRequest) {
    try {
        const campaignData = await request.json();
        
        // Validasi data wajib
        const requiredFields = ['title', 'target', 'image', 'description'];
        const missingFields = requiredFields.filter(field => !campaignData[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Data tidak lengkap. Field wajib: ${missingFields.join(', ')}` 
                },
                { status: 400 }
            );
        }

        // Validasi angka target
        const targetValue = Number(campaignData.target);
        if (isNaN(targetValue) || targetValue <= 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Target harus berupa angka positif" 
                },
                { status: 400 }
            );
        }

        await connectDB();
        
        // Buat kampanye baru dengan status pending
        const newCampaign = new Campaign({
            title: campaignData.title.trim(),
            category: campaignData.category || "Umum",
            target: targetValue,
            collected: 0,
            image: campaignData.image,
            description: campaignData.description.trim(),
            beneficiary: campaignData.beneficiary || "",
            location: campaignData.location || "",
            duration: campaignData.duration || "30 hari",
            details: campaignData.details || [],
            impact: campaignData.impact || [],
            admin: campaignData.admin || "User",
            contactPerson: campaignData.contactPerson || "",
            deadline: campaignData.deadline ? new Date(campaignData.deadline) : 
                     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 hari
            status: 'pending',
            createdBy: campaignData.createdBy || null // ID user yang membuat
        });

        const savedCampaign = await newCampaign.save();
        
        console.log(`✅ Campaign submitted: "${savedCampaign.title}" (ID: ${savedCampaign._id}, Status: pending)`);

        return NextResponse.json({
            success: true,
            message: "Kampanye berhasil diajukan! Menunggu verifikasi admin.",
            campaign: {
                _id: savedCampaign._id,
                title: savedCampaign.title,
                status: savedCampaign.status,
                createdAt: savedCampaign.createdAt
            }
        }, { status: 201 });
        
    } catch (error: any) {
        console.error("❌ Error submitting campaign:", error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Validasi gagal", 
                    errors: validationErrors 
                },
                { status: 400 }
            );
        }
        
        if (error.code === 11000) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Kampanye dengan judul serupa sudah ada" 
                },
                { status: 409 }
            );
        }
        
        return NextResponse.json(
            { 
                success: false, 
                message: "Terjadi kesalahan server. Silakan coba lagi nanti." 
            },
            { status: 500 }
        );
    }
}

// --- METHOD GET: Mengambil Campaign yang Disetujui ---
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        // Ambil query parameter untuk filter
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;
        
        // Bangun query filter
        const filter: any = {};
        
        // Filter status (default hanya approved untuk public)
        if (status) {
            filter.status = status;
        } else {
            filter.status = "approved";
        }
        
        // Filter kategori
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        // Eksekusi query dengan pagination
        const campaigns = await Campaign.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        
        // Hitung total dokumen untuk pagination
        const total = await Campaign.countDocuments(filter);
        
        console.log(`📊 Found ${campaigns.length} campaigns (${filter.status}) - Page ${page}`);
        
        // Format response dengan pagination info
        const formattedCampaigns = campaigns.map(campaign => ({
            _id: campaign._id.toString(),
            title: campaign.title || "",
            category: campaign.category || "Umum",
            target: campaign.target || 0,
            collected: campaign.collected || 0,
            deadline: campaign.deadline ? new Date(campaign.deadline).toISOString() : 
                     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            image: campaign.image || "https://images.unsplash.com/photo-1551836026-d5cbc8397c76",
            description: campaign.description || "",
            beneficiary: campaign.beneficiary || "",
            location: campaign.location || "",
            duration: campaign.duration || "30 hari",
            details: campaign.details || [],
            impact: campaign.impact || [],
            admin: campaign.admin || "Heartify",
            contactPerson: campaign.contactPerson || "",
            status: campaign.status || "approved",
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            // Hitung progress persentase
            progress: campaign.target > 0 ? 
                     Math.min(((campaign.collected || 0) / campaign.target) * 100, 100) : 0,
            // Hitung hari tersisa
            daysLeft: campaign.deadline ? 
                     Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 30
        }));
        
        return NextResponse.json({
            success: true,
            data: formattedCampaigns,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: skip + campaigns.length < total,
                hasPrev: page > 1
            }
        });
        
    } catch (error: any) {
        console.error("❌ API Error GET /api/campaign:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Gagal mengambil data kampanye",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined 
            },
            { status: 500 }
        );
    }
}

// --- METHOD PUT: Update Campaign (Optional) ---
export async function PUT(request: NextRequest) {
    try {
        const { id, ...updateData } = await request.json();
        
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID kampanye diperlukan" },
                { status: 400 }
            );
        }
        
        await connectDB();
        
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!updatedCampaign) {
            return NextResponse.json(
                { success: false, message: "Kampanye tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "Kampanye berhasil diperbarui",
            campaign: updatedCampaign
        });
        
    } catch (error: any) {
        console.error("❌ Error updating campaign:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memperbarui kampanye" },
            { status: 500 }
        );
    }
}

// --- METHOD DELETE: Hapus Campaign (Optional) ---
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID kampanye diperlukan" },
                { status: 400 }
            );
        }
        
        await connectDB();
        
        const deletedCampaign = await Campaign.findByIdAndDelete(id);
        
        if (!deletedCampaign) {
            return NextResponse.json(
                { success: false, message: "Kampanye tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "Kampanye berhasil dihapus"
        });
        
    } catch (error: any) {
        console.error("❌ Error deleting campaign:", error);
        return NextResponse.json(
            { success: false, message: "Gagal menghapus kampanye" },
            { status: 500 }
        );
    }
}