import React, { useState, useEffect } from "react";
import "./beranda.css"; 
import { Link } from "react-router-dom";

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
            <a href="/profile">Profil</a>
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
                  
                  <Link to={`/informasi/${campaign.id}`} className="campaign-see-more">
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
    </div>
  );
};

export default Beranda;