"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./beranda.css";

// --- DATA DUMMY (Hanya muncul jika sistem benar-benar kosong/baru pertama kali dibuka) ---
const initialCampaigns = [
  {
    id: "1",
    title: "Bantu Penuhi Gizi Anak-Anak",
    category: "Kesehatan",
    target: 15000000,
    collected: 4500000,
    description: "Bantu anak-anak kurang gizi...",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
    admin: "Yayasan Peduli Gizi",
    beneficiary: "Anak-anak Desa"
  },
  {
    id: "2",
    title: "Peralatan untuk Sekolah Desa",
    category: "Pendidikan",
    target: 5000000,
    collected: 4500000,
    description: "Bantu peralatan sekolah...",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
    admin: "Komunitas Pendidikan",
    beneficiary: "Sekolah Dasar"
  },
  {
    id: "3",
    title: "Bantuan Korban Gempa Bumi",
    category: "Kemanusiaan",
    target: 25000000,
    collected: 8200000,
    description: "Korban gempa membutuhkan bantuan...",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    admin: "PMI",
    beneficiary: "Korban Gempa"
  },
];

const reportData = [
  { id: 1, title: "Bantuan Korban Bencana", category: "Lainnya", amount: 8500000, date: "25 Juli 2025", image: "https://plus.unsplash.com/premium_photo-1695566086196-1cdadbaa1988?q=80&w=1170&auto=format&fit=crop" },
  { id: 2, title: "Donasi untuk Alat Tulis", category: "Pendidikan", amount: 3000000, date: "18 Juli 2025", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200" },
  { id: 3, title: "Santunan Panti Asuhan", category: "Kemanusiaan", amount: 5200000, date: "15 Juli 2025", image: "https://images.unsplash.com/photo-1617878227827-8360231f7f03?q=80&w=1256" },
];

const Beranda: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(reportData);
  const [campaigns, setCampaigns] = useState<any[]>([]); 
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    // 1. Cek Role User untuk Navbar
    const userData = localStorage.getItem("registeredUser");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserRole(parsed.role || "user");
    }

    // 2. LOAD DATA KAMPANYE (Logic Penting)
    const loadCampaigns = () => {
      // Ambil data yang sudah disetujui Admin
      const savedCampaigns = localStorage.getItem("campaignsData");
      
      if (savedCampaigns) {
        // Jika ada data dari Admin, gunakan itu
        const parsedData = JSON.parse(savedCampaigns);
        
        // Pastikan angka target/collected valid (convert string to number)
        const validData = parsedData.map((c: any) => ({
          ...c,
          target: Number(c.target) || 0,
          collected: Number(c.collected) || 0
        }));
        
        setCampaigns(validData);
      } else {
        // Jika belum ada data sama sekali (baru buka web), load data dummy awal
        setCampaigns(initialCampaigns);
        // Simpan dummy ke storage agar Admin juga bisa melihat data awal ini
        localStorage.setItem("campaignsData", JSON.stringify(initialCampaigns));
      }
    };

    loadCampaigns();

    // Event listener agar jika ada update di tab lain, beranda ikut update
    window.addEventListener('storage', loadCampaigns);
    return () => window.removeEventListener('storage', loadCampaigns);
  }, []);

  // Format Mata Uang (Rp)
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  
  // Hitung Progress Bar (%)
  const calculateProgress = (target: number, collected: number) => {
    if (target <= 0) return 0;
    return Math.min((collected / target) * 100, 100);
  };

  // Hitung Sisa Donasi
  const calculateRemaining = (target: number, collected: number) => Math.max(0, target - collected);

  // Fitur Search Laporan
  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) setSearchResults(reportData);
    else setSearchResults(reportData.filter(r => r.title.toLowerCase().includes(term) || r.category.toLowerCase().includes(term)));
  };
  
  const clearSearch = () => { setSearchTerm(""); setSearchResults(reportData); };

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  return (
    <div className="beranda-body">
      {/* === NAVBAR === */}
      <header className="navbar-container">
        <nav className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda" className="active-link" style={{borderBottom: "2px solid #8b1c15", color: "#8b1c15"}}>Beranda</Link>
            <Link href="/about">Tentang Kami</Link>
            
            {/* Logic Menu: User -> Ajukan, Admin -> Dashboard */}
            {userRole === "admin" ? (
              <Link href="/admin" style={{color: '#d35400', fontWeight: 'bold'}}>Dashboard Admin</Link>
            ) : (
              <Link href="/ajukankampanye">Ajukan Kampanye</Link>
            )}

            <Link href="/profile">Profile</Link>
          </div>
          <button onClick={handleLogout} className="navbar-login-button">Keluar</button>
        </nav>
      </header>

      {/* === HERO SECTION === */}
      <section className="hero-section-beranda">
        <div className="hero-content">
          <h1 className="hero-title-beranda">Extend Your Hand, <br /> Ignite Their Hope</h1>
          <p className="hero-subtitle-beranda">Setiap kebaikan yang Anda bagikan akan menjadi secercah cahaya bagi mereka yang membutuhkan. Mari bersama wujudkan perubahan nyata.</p>
          <a href="#kampanye" className="button button-cream">Mulai Donasi</a>
        </div>
      </section>

      {/* === INFORMASI KAMPANYE SECTION === */}
      <section id="kampanye" className="campaign-section">
        <div className="section-header">
          <span className="section-tag">INFORMASI KAMPANYE</span>
          <h2 className="section-title-dark">Bantuan Mendesak Dibutuhkan</h2>
        </div>

        <div className="campaign-grid">
          {campaigns.map((campaign) => {
            const progress = calculateProgress(campaign.target, campaign.collected);
            const remaining = calculateRemaining(campaign.target, campaign.collected);

            return (
              <div key={campaign.id} className="campaign-card">
                {/* Image Handling: Jika URL rusak, ganti ke placeholder */}
                <img 
                  src={campaign.image} 
                  alt={campaign.title} 
                  className="campaign-image"
                  onError={(e: any) => {
                    e.target.src = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop"; 
                  }}
                />
                
                <div className="campaign-card-content">
                  {/* Badge Kategori: Menggunakan class 'campaign-category-badge' agar merah kotak */}
                  <span className="campaign-category-badge">
                    {campaign.category}
                  </span>

                  <h3 className="campaign-title">{campaign.title}</h3>
                  
                  <div className="campaign-details">
                    <p>Target: <span>{formatCurrency(campaign.target)}</span></p>
                    <p>Terkumpul: <span>{formatCurrency(campaign.collected)}</span></p>
                    <p>Sisa: <span>{formatCurrency(remaining)}</span></p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  
                  {/* Link ke Detail */}
                  <Link href={`/informasi/${campaign.id}`} className="campaign-see-more">
                    Lihat Selengkapnya →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === LAPORAN DONASI SECTION === */}
      <section className="report-section">
        <div className="section-header">
          <span className="section-tag">LAPORAN DONASI</span>
          <h2 className="section-title-dark">Amanah yang Telah Tersalurkan</h2>
        </div>
        
        <div className="search-bar-container">
          <div className="search-wrapper">
            <input type="text" placeholder="Cari laporan..." className="search-bar" value={searchTerm} onChange={handleSearch} />
            {searchTerm && <button className="clear-search-btn" onClick={clearSearch}>✕</button>}
          </div>
        </div>

        <div className="report-grid">
          {searchResults.map((report) => (
            <div key={report.id} className="report-card">
              <img src={report.image} alt={report.title} className="report-image" />
              <div className="report-card-content">
                <span className="campaign-category-badge" style={{marginBottom: '0.5rem'}}>{report.category}</span>
                <h3 className="report-title">{report.title}</h3>
                <p className="report-info">Terkumpul: {formatCurrency(report.amount)}</p>
                <p className="report-date">Diterbitkan: {report.date}</p>
                <Link href="/laporan" className="button button-dark-full">Lihat Laporan ❯</Link>
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