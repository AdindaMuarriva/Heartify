"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./beranda.css";

interface Campaign {
  _id: string;
  title: string;
  category: string;
  target: number;
  image: string;
  deadline: string;
}

const Beranda = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reports, setReports] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH DATA ================= */
useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaign");
      const result = await res.json();

      // Ambil array campaign dari properti `data`
      const campaigns: Campaign[] = Array.isArray(result.data)
        ? result.data
        : [];

      setCampaigns(campaigns);

      // Laporan = campaign yang sudah melewati deadline
      const today = new Date();
      const finishedCampaigns = campaigns.filter(
        (campaign) => new Date(campaign.deadline) < today
      );

      setReports(finishedCampaigns);
    } catch (error) {
      console.error("Gagal mengambil data campaign:", error);
      setCampaigns([]);
      setReports([]);
    }
  };

  fetchCampaigns();
}, []);


  /* ================= UTIL ================= */
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= RENDER ================= */
  return (
    <div className="beranda-body">

      {/* Navbar */}
      <header className="navbar-container">
        <nav className="navbar">
          <a href="/" className="navbar-logo">
            Heartify
          </a>
          <div className="navbar-links">
            <a href="/beranda">Beranda</a>
            <a href="/about">Tentang Kami</a>
            <a href="/ajukankampanye" >Ajukan Kampanye</a>
            <a href="/Profile">Profile</a>
          </div>
          <a href="/login" className="navbar-login-button">
            Keluar
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section-beranda">
        <div className="hero-content">
          <h1 className="hero-title-beranda">
            Extend Your Hand, <br />
            Ignite Their Hope
          </h1>
          <p className="hero-subtitle-beranda">
            Setiap kebaikan yang Anda bagikan akan menjadi secercah cahaya bagi
            mereka yang membutuhkan. Mari bersama wujudkan perubahan nyata.
          </p>
          <a href="#kampanye" className="button button-cream">
            Lihat Kampanye
          </a>
        </div>
      </section>

      {/* ================= KAMPANYE ================= */}
      <section className="campaign-section">
        <div className="section-header">
          <span className="section-tag">INFORMASI KAMPANYE</span>
          <h2 className="section-title-dark">Bantuan Mendesak Dibutuhkan</h2>
        </div>

        <div className="campaign-grid">
          {campaigns.map((campaign, index) => (
            <div key={campaign._id} className="campaign-card">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="campaign-image"
              />

              <div className="campaign-card-content">
                <span className={`campaign-category-${campaign.category.toLowerCase()}`}>
                  {campaign.category}
                </span>

                <h3 className="campaign-title">{campaign.title}</h3>

                <p>
                  Target: <strong>{formatCurrency(campaign.target)}</strong>
                </p>

                {/* DEBUG INFO */}
                <div style={{ 
                  fontSize: '10px', 
                  color: '#666', 
                  marginTop: '5px',
                  backgroundColor: '#f5f5f5',
                  padding: '3px',
                  borderRadius: '3px',
                  fontFamily: 'monospace'
                }}>
                  ID: {campaign._id}<br/>
                  Length: {campaign._id?.length || 'undefined'}
                </div>

                <Link
                  href={`/informasi/${encodeURIComponent(campaign._id)}`}
                  className="campaign-see-more"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('=== DEBUG INFO ===');
                    console.log('Campaign index:', index);
                    console.log('Campaign title:', campaign.title);
                    console.log('Campaign _id:', campaign._id);
                    console.log('Campaign _id type:', typeof campaign._id);
                    console.log('Campaign _id length:', campaign._id?.length);
                    console.log('Encoded ID:', encodeURIComponent(campaign._id));
                    console.log('URL akan ke:', `/informasi/${campaign._id}`);
                    
                    // Navigasi setelah log
                    window.location.href = `/informasi/${campaign._id}`;
                  }}
                >
                  Lihat Selengkapnya →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LAPORAN DONASI ================= */}
      <section className="report-section">
        <div className="section-header">
          <span className="section-tag">LAPORAN DONASI</span>
          <h2 className="section-title-dark">
            Amanah yang Telah Tersalurkan
          </h2>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Cari berdasarkan judul"
            className="search-bar"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <p className="search-info">
            Menampilkan {filteredReports.length} laporan donasi
          </p>
        </div>

        <div className="report-grid">
          {filteredReports.map(report => (
            <div key={report._id} className="report-card">
              <img
                src={report.image}
                alt={report.title}
                className="report-image"
              />

              <div className="report-card-content">
                <span className={`report-category-${report.category.toLowerCase()}`}>
                  {report.category}
                </span>

                <h3 className="report-title">{report.title}</h3>

                <p className="report-info">
                  Terkumpul: {formatCurrency(report.target)}
                </p>

                <p className="report-date">
                  Diterbitkan:{" "}
                  {new Date(report.deadline).toLocaleDateString("id-ID")}
                </p>

                <Link href="/laporan" className="button button-dark-full">
                  Lihat Laporan →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column footer-about">
              <h3>Tentang Heartify</h3>
              <p>
                Heartify adalah platform donasi digital yang menghubungkan kebaikan hati dengan 
                mereka yang membutuhkan. Dengan teknologi dan transparansi, kami wujudkan 
                perubahan berkelanjutan.
              </p>
              <div className="social-links">
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h3>Tautan Cepat</h3>
              <ul className="footer-links">
                <li><a href="/about">Tentang Kami</a></li>
                <li><a href="/campaigns">Program Donasi</a></li>
                <li><a href="/impact">Dampak Kami</a></li>
                <li><a href="/stories">Cerita Inspiratif</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Program</h3>
              <ul className="footer-links">
                <li><a href="/program/education">Pendidikan</a></li>
                <li><a href="/program/healthcare">Kesehatan</a></li>
                <li><a href="/program/disaster">Bencana Alam</a></li>
                <li><a href="/program/economic">Pemberdayaan</a></li>
                <li><a href="/program/emergency">Darurat</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Kontak</h3>
              <div className="contact-info">
                <a href="mailto:support@heartify.org">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>support@heartify.org</span>
                </a>
                <p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+62 822 2222 2223</span>
                </p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2025 Heartify. Hak cipta dilindungi undang-undang. 
              Komitmen kami untuk transparansi dan akuntabilitas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Beranda;
