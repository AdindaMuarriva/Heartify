// app/informasi/[id]/page.tsx - FINAL VERSION with Donation Modal Integration
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import "./detailkampanye.css";
import DonationModal from "@/components/DonationModal"; // <-- IMPORT MODAL BARU

interface Campaign {
  _id: string;
  title: string;
  category: string;
  target: number;
  collected: number;
  beneficiary: string;
  deadline: string;
  image: string;
  description: string;
  admin: string;
  location: string;
  duration: string;
  details: string[];
  impact: string[];
  status: string;
  contactPerson?: string;
}

export default function DetailKampanye() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false); // <-- STATE UNTUK MODAL

  useEffect(() => {
    if (!id) {
      setError("ID kampanye tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    fetchCampaign();
  }, [id]);

  // Fungsi fetch diganti namanya menjadi fetchCampaign dan dijadikan callback terpisah
  // agar bisa dipanggil saat modal berhasil di-submit (onSuccess)
  const fetchCampaign = async () => {
    try {
      setLoading(true); // Set loading di awal fetch
      const apiUrl = `/api/campaign/${id}`;

      const response = await fetch(apiUrl);

      const data = await response.json();
      setApiResponse(data);

      if (!response.ok || !data) {
        throw new Error(data.error || `HTTP ${response.status}: Gagal memuat data`);
      }

      // Di sini, asumsi API Detail Campaign mengembalikan objek Campaign utuh, bukan { data: Campaign }
      setCampaign(data);
      setError(null);
    } catch (err: any) {
      console.error("💥 Error in fetchCampaign:", err);
      setError(err.message || "Gagal memuat detail kampanye");
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      let date: Date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      console.warn("Date parsing error:", e);
      return dateString;
    }
  };

  if (loading) {
    // ... Loading state ...
  }

  if (error || !campaign) {
    // ... Error state ...
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat detail kampanye...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="error-container">
        <h2>❌ Kampanye tidak ditemukan</h2>
        <p>
          <strong>Error:</strong> {error || "Data tidak tersedia"}
        </p>
        <div className="error-actions">
          <button onClick={() => router.back()} className="button button-dark-full">
            ← Kembali
          </button>
          <Link href="/beranda" className="button button-cream">
            Ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const progress =
    campaign.target > 0
      ? Math.min((campaign.collected / campaign.target) * 100, 100)
      : 0;

  return (
    <div className="detail-body">
      {/* Hero Section */}
      <section
        className="detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${campaign.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="detail-hero-overlay">
          <h1 className="detail-title">{campaign.title}</h1>
          <span className={`detail-category ${campaign.category.toLowerCase()}`}>
            {campaign.category}
          </span>
          {campaign.status === "completed" && (
            <div
              style={{
                marginTop: "10px",
                display: "inline-block",
                background: "#10b981",
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                fontSize: "0.9rem",
              }}
            >
              ✅ Program Selesai
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="detail-container">
        <div className="detail-info">
          <h2>Tentang Kampanye</h2>
          <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
            {campaign.description}
          </p>

          <div
            className="campaign-meta"
            style={{
              marginTop: "2rem",
              background: "#f8f9fa",
              padding: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <p>
              <strong>📍 Lokasi:</strong>{" "}
              {campaign.location || "Tidak ditentukan"}
            </p>
            <p>
              <strong>👥 Penerima Manfaat:</strong> {campaign.beneficiary}
            </p>
            <p>
              <strong>⏱️ Durasi Program:</strong> {campaign.duration}
            </p>
            <p>
              <strong>📅 Batas Waktu Donasi:</strong>{" "}
              {formatDate(campaign.deadline)}
            </p>
            <p>
              <strong>🏢 Dikelola oleh:</strong> {campaign.admin}
            </p>
            {campaign.contactPerson && campaign.contactPerson !== "-" && (
              <p>
                <strong>📞 Contact Person:</strong>{" "}
                {campaign.contactPerson}
              </p>
            )}
          </div>

          {/* Detail Penyaluran */}
          {campaign.details && campaign.details.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ color: "#3e0703", marginBottom: "1rem" }}>
                Detail Penyaluran Dana
              </h3>
              <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" }}>
                {campaign.details.map((detail, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: "0.8rem", lineHeight: "1.6" }}
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dampak */}
          {campaign.impact && campaign.impact.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ color: "#3e0703", marginBottom: "1rem" }}>
                Dampak yang Akan Dicapai
              </h3>
              <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" }}>
                {campaign.impact.map((impact, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: "0.8rem", lineHeight: "1.6" }}
                  >
                    {impact}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Donation Card */}
        <div className="detail-card">
          <h2
            style={{
              color: "#3e0703",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontSize: "1.3rem",
            }}
          >
            Status Donasi
          </h2>

          <div className="amount-info">
            <div className="amount-row">
              <span>Target:</span>
              <strong style={{ fontSize: "1.2rem" }}>
                {formatCurrency(campaign.target)}
              </strong>
            </div>
            <div className="amount-row">
              <span>Terkumpul:</span>
              <strong
                className="collected"
                style={{ fontSize: "1.2rem", color: "#8b1c15" }}
              >
                {formatCurrency(campaign.collected)}
              </strong>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #8b1c15, #b32820)",
                  height: "100%",
                  borderRadius: "8px",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <div
              className="progress-text"
              style={{
                marginTop: "0.8rem",
                fontWeight: "600",
                color: "#3e0703",
              }}
            >
              {progress.toFixed(1)}% tercapai
            </div>
          </div>

          <button
            className="button button-dark-full"
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
            onClick={() => setShowModal(true)}
          >
            💝 Donasi Sekarang
          </button>

          <Link
            href="/beranda"
            className="back-link"
            style={{ marginTop: "1rem", display: "block", textAlign: "center" }}
          >
            ← Kembali ke Beranda
          </Link>

          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor:
                campaign.status === "completed"
                  ? "#d1fae5"
                  : campaign.status === "approved"
                  ? "#dbeafe"
                  : "#fef3c7",
              textAlign: "center",
              fontSize: "0.95rem",
              color:
                campaign.status === "completed"
                  ? "#065f46"
                  : campaign.status === "approved"
                  ? "#1e40af"
                  : "#92400e",
              fontWeight: "500",
            }}
          >
            <strong>Status:</strong>{" "}
            {campaign.status === "pending"
              ? "Menunggu Persetujuan"
              : campaign.status === "approved"
              ? "Aktif"
              : "Selesai"}
          </div>

          <div
            style={{
              marginTop: "1rem",
              fontSize: "10px",
              color: "#999",
              textAlign: "center",
              fontFamily: "monospace",
              wordBreak: "break-all",
            }}
          >
            ID: {campaign._id}
          </div>
        </div>
      </section>

      {showModal && (
        <DonationModal
          campaignId={campaign._id}
          campaignTitle={campaign.title}
          onClose={() => setShowModal(false)}
          onSuccess={fetchCampaign}
        />
      )}
    </div>
  );
}

