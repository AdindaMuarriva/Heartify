import React, { useState } from "react";
import "./beranda.css"; 

// Data dummy untuk laporan donasi
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
    title: "Santunan Panti Jompo",
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
          {/* Contoh Kartu Kampanye 1 */}
          <div className="campaign-card">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
              alt="Bantuan Pangan"
              className="campaign-image"
            />
            <div className="campaign-card-content">
              <span className="campaign-category-kesehatan">Kesehatan</span>
              <h3 className="campaign-title">Bantu Penuhi Gizi Anak-Anak</h3>
              <div className="campaign-details">
                <p>
                  Target: <span>Rp 15.000.000</span>
                </p>
                <p>
                  Terkumpul: <span>Rp 4.500.000</span>
                </p>
                <p>
                  Sisa: <span>Rp 10.500.000</span>
                </p>
              </div>
              <a href="/informasi1" className="campaign-see-more">
                Lihat Selengkapnya →
              </a>
            </div>
          </div>

          {/* Contoh Kartu Kampanye 2 */}
          <div className="campaign-card">
            <img
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop"
              alt="Donasi Pendidikan"
              className="campaign-image"
            />
            <div className="campaign-card-content">
              <span className="campaign-category-edukasi">Pendidikan</span>
              <h3 className="campaign-title">Peralatan untuk Sekolah Desa</h3>
              <div className="campaign-details">
                <p>
                  Target: <span>Rp 5.000.000</span>
                </p>
                <p>
                  Terkumpul: <span>Rp 5.000.000</span>
                </p>
                <p>
                  Sisa: <span>Rp 0</span>
                </p>
              </div>
              <a href="/informasi2" className="campaign-see-more">
                Lihat Selengkapnya →
              </a>
            </div>
          </div>

          {/* Contoh Kartu Kampanye 3 - TAMBAHAN */}
          <div className="campaign-card">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
              alt="Bantuan Bencana Alam"
              className="campaign-image"
            />
            <div className="campaign-card-content">
              <span className="campaign-category-kemanusiaan">Kemanusiaan</span>
              <h3 className="campaign-title">Bantuan Korban Gempa Bumi</h3>
              <div className="campaign-details">
                <p>
                  Target: <span>Rp 25.000.000</span>
                </p>
                <p>
                  Terkumpul: <span>Rp 8.200.000</span>
                </p>
                <p>
                  Sisa: <span>Rp 16.800.000</span>
                </p>
              </div>
              <a href="/informasi3" className="campaign-see-more">
                Lihat Selengkapnya →
              </a>
            </div>
          </div>
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
              placeholder="Cari berdasarkan judul atau kategori..."
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
                  <a href="#" className="button button-dark-full">
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