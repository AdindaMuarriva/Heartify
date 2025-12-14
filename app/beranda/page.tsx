"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./beranda.css";

// Data dummy untuk laporan donasi
const initialCampaigns = [
  {
    id: "1",
    title: "Bantu Penuhi Gizi Anak-Anak",
    category: "Kesehatan",
    target: 15000000,
    collected: 4500000,
    description:
      "Banyak anak-anak yang masih kekurangan gizi. Melalui kampanye ini, kami berusaha memberikan makanan bergizi agar mereka tumbuh sehat dan kuat.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
    admin: "Yayasan Peduli Gizi Indonesia",
    beneficiary: "Anak-anak kurang gizi di daerah terpencil",
    paymentMethods: [
      {
        name: "Bank Transfer",
        providers: ["BCA", "Mandiri", "BNI", "BRI"],
        icon: "🏦",
      },
      {
        name: "E-Wallet",
        providers: ["GoPay", "OVO", "Dana", "ShopeePay"],
        icon: "📱",
      },
      {
        name: "Credit Card",
        providers: ["Visa", "MasterCard", "JCB"],
        icon: "💳",
      },
    ],
  },
  {
    id: "2",
    title: "Peralatan untuk Sekolah Desa",
    category: "Pendidikan",
    target: 5000000,
    collected: 4500000,
    description:
      "Bantu kami menyediakan peralatan sekolah seperti buku, pensil, dan seragam agar anak-anak di desa bisa belajar lebih nyaman.",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
    admin: "Komunitas Pendidikan Desa",
    beneficiary: "Sekolah-sekolah di daerah tertinggal",
    paymentMethods: [
      {
        name: "Bank Transfer",
        providers: ["BCA", "Mandiri", "BNI"],
        icon: "🏦",
      },
      {
        name: "E-Wallet",
        providers: ["GoPay", "OVO", "Dana"],
        icon: "📱",
      },
    ],
  },
  {
    id: "3",
    title: "Bantuan Korban Gempa Bumi",
    category: "Kemanusiaan",
    target: 25000000,
    collected: 8200000,
    description:
      "Korban gempa membutuhkan makanan, tempat tinggal sementara, serta layanan medis darurat. Mari bantu mereka bangkit kembali.",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    admin: "Palang Merah Indonesia",
    beneficiary: "Korban gempa di wilayah terdampak",
    paymentMethods: [
      {
        name: "Bank Transfer",
        providers: ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga"],
        icon: "🏦",
      },
      {
        name: "E-Wallet",
        providers: ["GoPay", "OVO", "Dana", "LinkAja", "ShopeePay"],
        icon: "📱",
      },
      {
        name: "Credit Card",
        providers: ["Visa", "MasterCard", "American Express"],
        icon: "💳",
      },
      {
        name: "Convenience Store",
        providers: ["Alfamart", "Indomaret"],
        icon: "🏪",
      },
    ],
  },
];

const reportData = [
  {
    id: 1,
    title: "Bantuan Korban Bencana",
    category: "Lainnya",
    amount: 8500000,
    date: "25 Juli 2025",
    image: "https://plus.unsplash.com/premium_photo-1695566086196-1cdadbaa1988?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "Donasi untuk Alat Tulis",
    category: "Pendidikan",
    amount: 3000000,
    date: "18 Juli 2025",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Santunan Panti Asuhan",
    category: "Kemanusiaan",
    amount: 5200000,
    date: "15 Juli 2025",
    image: "https://images.unsplash.com/photo-1617878227827-8360231f7f03?q=80&w=1256&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 4,
    title: "Bantuan Medis Darurat",
    category: "Kesehatan",
    amount: 12000000,
    date: "10 Juli 2025",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 5,
    title: "Beasiswa Anak Yatim",
    category: "Pendidikan",
    amount: 7500000,
    date: "5 Juli 2025",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 6,
    title: "Bantuan Pangan Darurat",
    category: "Kemanusiaan",
    amount: 9500000,
    date: "1 Juli 2025",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const Beranda: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(reportData);
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  // Load data dari localStorage saat komponen mount dan setiap kali ada perubahan
  useEffect(() => {
    const loadCampaigns = () => {
      const savedCampaigns = localStorage.getItem("campaignsData");
      if (savedCampaigns) {
        setCampaigns(JSON.parse(savedCampaigns));
      } else {
        // Jika belum ada data di localStorage, gunakan data awal dan simpan
        localStorage.setItem("campaignsData", JSON.stringify(initialCampaigns));
      }
    };

    loadCampaigns();

    // Tambahkan event listener untuk mendeteksi perubahan di localStorage
    const handleStorageChange = () => {
      loadCampaigns();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Polling untuk update real-time (opsional, untuk tab/window yang sama)
    const interval = setInterval(loadCampaigns, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults(reportData);
    } else {
      const filtered = reportData.filter(report => 
        report.title.toLowerCase().includes(term) ||
        report.category.toLowerCase().includes(term)
      );
      setSearchResults(filtered);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(reportData);
  };

  // Hitung sisa donasi
  const calculateRemaining = (target: number, collected: number): number => {
    return Math.max(0, target - collected);
  };

  // Hitung progress percentage
  const calculateProgress = (target: number, collected: number): number => {
    return Math.min((collected / target) * 100, 100);
  };

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
            <a href="/ajukankampanye">Ajukan Kampanye</a>
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

      {/* Informasi Kampanye Section */}
      <section id="kampanye" className="campaign-section">
        <div className="section-header">
          <span className="section-tag">INFORMASI KAMPANYE</span>
          <h2 className="section-title-dark">Bantuan Mendesak Dibutuhkan</h2>
        </div>

        <div className="campaign-grid">
          {campaigns.map((campaign) => {
            const remaining = calculateRemaining(campaign.target, campaign.collected);
            const progress = calculateProgress(campaign.target, campaign.collected);
            
            return (
              <div key={campaign.id} className="campaign-card">
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
                  <div className="campaign-details">
                    <p>
                      Target: <span>{formatCurrency(campaign.target)}</span>
                    </p>
                    <p>
                      Terkumpul: <span>{formatCurrency(campaign.collected)}</span>
                    </p>
                    <p>
                      Sisa: <span>{formatCurrency(remaining)}</span>
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="progress-bar" style={{margin: '10px 0'}}>
                    <div 
                      className="progress" 
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: '#3e0703',
                        height: '8px',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} 
                    ></div>
                  </div>
                  
                  <Link href={`/informasi/${campaign.id}`} className="campaign-see-more">
                    Lihat Selengkapnya →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Laporan Donasi Section */}
      <section className="report-section">
        <div className="section-header">
          <span className="section-tag">LAPORAN DONASI</span>
          <h2 className="section-title-dark">Amanah yang Telah Tersalurkan</h2>
        </div>
        
        <div className="search-bar-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Cari berdasarkan judul"
              className="search-bar"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={clearSearch}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-info">
            <p>
              {searchTerm ? 
                `Ditemukan ${searchResults.length} hasil untuk "${searchTerm}"` : 
                `Menampilkan semua ${reportData.length} laporan donasi`
              }
            </p>
          </div>
        </div>

        <div className="report-grid">
          {searchResults.length > 0 ? (
            searchResults.map((report) => (
              <div key={report.id} className="report-card">
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
                  <p className="report-info">Terkumpul: {formatCurrency(report.amount)}</p>
                  <p className="report-date">Diterbitkan: {report.date}</p>
                  <a href="/laporan" className="button button-dark-full">
                    Lihat Laporan ❯
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>Tidak ditemukan laporan yang sesuai</h3>
              <p>Coba gunakan kata kunci lain atau lihat semua laporan</p>
              <button onClick={clearSearch} className="button button-cream">
                Tampilkan Semua Laporan
              </button>
            </div>
          )}
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