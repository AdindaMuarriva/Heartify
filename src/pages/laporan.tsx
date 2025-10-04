import React, { useState, useEffect } from "react";
import "./laporan.css";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';

// Dalam component Laporan
const generatePDF = (report: any) => {
  const doc = new jsPDF();
  
  // Helper function untuk format currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Judul
  doc.setFontSize(20);
  doc.setTextColor(62, 7, 3);
  doc.text('LAPORAN DONASI', 105, 20, { align: 'center' });
  
  // Garis pembatas
  doc.setDrawColor(139, 28, 21);
  doc.line(20, 25, 190, 25);
  
  // Informasi Program
  doc.setFontSize(16);
  doc.text(report.title, 20, 40);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  // Gunakan variable untuk tracking posisi Y
  let currentY = 50;
  
  doc.text(`Kategori: ${report.category}`, 20, currentY);
  currentY += 6;
  doc.text(`Lokasi: ${report.location}`, 20, currentY);
  currentY += 6;
  doc.text(`Jumlah Donasi: ${formatAmount(report.amount)}`, 20, currentY);
  currentY += 6;
  doc.text(`Tanggal Selesai: ${report.completionDate}`, 20, currentY);
  currentY += 6;
  doc.text(`Penerima Manfaat: ${report.beneficiaries}`, 20, currentY);
  currentY += 6;
  doc.text(`Durasi Program: ${report.duration}`, 20, currentY);
  currentY += 15;
  
  // Deskripsi
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Deskripsi Program:', 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  const splitDescription = doc.splitTextToSize(report.description, 170);
  doc.text(splitDescription, 20, currentY);
  currentY += (splitDescription.length * 6) + 10;
  
  // Detail Penyaluran
  doc.setFontSize(12);
  doc.text('Detail Penyaluran Dana:', 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  report.details.forEach((detail: string) => {
    doc.text(`• ${detail}`, 25, currentY);
    currentY += 6;
  });
  
  currentY += 5;
  
  // Dampak yang Dicapai
  doc.setFontSize(12);
  doc.text('Dampak yang Dicapai:', 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  report.impact.forEach((impact: string) => {
    doc.text(`• ${impact}`, 25, currentY);
    currentY += 6;
  });
  
  currentY += 10;
  
  // Penanggung Jawab
  doc.setFontSize(12);
  doc.text('Penanggung Jawab:', 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  doc.text(`Organisasi: ${report.admin}`, 25, currentY);
  currentY += 6;
  doc.text(`Contact Person: ${report.contactPerson}`, 25, currentY);
  
  // Footer
  const footerY = 280;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Dokumen ini dibuat secara otomatis oleh sistem Heartify', 105, footerY, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('id-ID')}`, 105, footerY + 5, { align: 'center' });
  
  // Simpan PDF
  doc.save(`Laporan_Donasi_${report.title.replace(/\s+/g, '_')}.pdf`);
};

// Data dummy untuk laporan donasi - HANYA YANG SUDAH SELESAI
const reportData = [
  {
    id: 1,
    title: "Bantuan Korban Bencana Gempa",
    category: "Kemanusiaan",
    amount: 8500000,
    date: "25 Juli 2025",
    image: "https://plus.unsplash.com/premium_photo-1695566086196-1cdadbaa1988?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Bantuan darurat telah disalurkan kepada korban gempa di Kabupaten Cianjur. Dana digunakan untuk memenuhi kebutuhan pokok, tempat tinggal sementara, dan layanan medis darurat bagi para korban.",
    details: [
      "Paket sembako untuk 200 keluarga terdampak",
      "Pendirian 15 tenda pengungsian darurat",
      "Layanan kesehatan dan obat-obatan dasar",
      "Air bersih dan fasilitas sanitasi"
    ],
    location: "Kabupaten Cianjur, Jawa Barat",
    beneficiaries: "500+ penerima manfaat",
    duration: "2 minggu",
    admin: "Palang Merah Indonesia",
    contactPerson: "Budi Santoso - 0812-3456-7890",
    impact: [
      "500 orang mendapatkan bantuan pokok",
      "15 keluarga mendapatkan tempat tinggal sementara",
      "200 anak mendapatkan akses pendidikan darurat"
    ],
    completionDate: "25 Juli 2025"
  },
  {
    id: 2,
    title: "Donasi Perlengkapan Sekolah",
    category: "Pendidikan",
    amount: 3000000,
    date: "18 Juli 2025",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description: "Program bantuan perlengkapan sekolah untuk anak-anak di daerah terpencil Papua. Donasi digunakan untuk membeli alat tulis, seragam, dan tas sekolah.",
    details: [
      "150 set alat tulis lengkap",
      "75 seragam sekolah baru",
      "50 tas sekolah dan sepatu",
      "Buku bacaan dan edukasi"
    ],
    location: "Kabupaten Jayawijaya, Papua",
    beneficiaries: "150 siswa",
    duration: "1 bulan",
    admin: "Yayasan Peduli Pendidikan Indonesia",
    contactPerson: "Sari Dewi - 0813-9876-5432",
    impact: [
      "150 siswa mendapatkan perlengkapan sekolah lengkap",
      "75 siswa mendapatkan seragam baru",
      "50 siswa mendapatkan tas dan sepatu"
    ],
    completionDate: "18 Juli 2025"
  },
  {
    id: 3,
    title: "Bantuan Medis dan Operasi",
    category: "Kesehatan",
    amount: 12000000,
    date: "10 Juli 2025",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Bantuan medis komprehensif untuk pasien tidak mampu yang membutuhkan operasi dan perawatan intensif. Program bekerjasama dengan rumah sakit mitra.",
    details: [
      "Biaya operasi jantung untuk 2 pasien",
      "Pengobatan kanker untuk 5 pasien",
      "Alat bantu medis dan prostetik",
      "Rehabilitasi dan terapi pasca-operasi"
    ],
    location: "Rumah Sakit Umum Pusat, Jakarta",
    beneficiaries: "15 pasien",
    duration: "3 bulan",
    admin: "Yayasan Peduli Kesehatan Nasional",
    contactPerson: "dr. Maya Sari - 0811-2233-4455",
    impact: [
      "15 pasien mendapatkan perawatan medis gratis",
      "2 operasi jantung berhasil dilakukan",
      "5 pasien kanker menjalani kemoterapi"
    ],
    completionDate: "10 Juli 2025"
  },
  {
    id: 4,
    title: "Program Pangan Darurat",
    category: "Kemanusiaan",
    amount: 9500000,
    date: "1 Juli 2025",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Program bantuan pangan darurat untuk keluarga prasejahtera di daerah rawan pangan dengan pendekatan pemberdayaan masyarakat.",
    details: [
      "Paket sembako untuk 300 keluarga",
      "Edukasi gizi dan kesehatan keluarga",
      "Program kebun gizi masyarakat",
      "Pelatihan pengolahan pangan sehat"
    ],
    location: "Desa Tertinggal, Nusa Tenggara Timur",
    beneficiaries: "300 keluarga",
    duration: "2 bulan",
    admin: "Yayasan Pangan untuk Negeri",
    contactPerson: "Bambang Sutrisno - 0838-4455-6677",
    impact: [
      "1.500 orang mendapatkan akses pangan stabil",
      "300 keluarga teredukasi gizi seimbang",
      "50 kebun gizi masyarakat terbentuk"
    ],
    completionDate: "1 Juli 2025"
  },
  {
    id: 5,
    title: "Renovasi Sekolah Darurat",
    category: "Pendidikan",
    amount: 6500000,
    date: "28 Juni 2025",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
    description: "Renovasi dan perbaikan fasilitas sekolah darurat di daerah bencana untuk memastikan kelancaran proses belajar mengajar.",
    details: [
      "Perbaikan 5 ruang kelas",
      "Penyediaan meja dan kursi belajar",
      "Perpustakaan mini dengan 500 buku",
      "Fasilitas sanitasi dan air bersih"
    ],
    location: "Pidie Jaya, Aceh",
    beneficiaries: "200 siswa",
    duration: "1.5 bulan",
    admin: "Yayasan Pendidikan Indonesia",
    contactPerson: "Rina Marlina - 0821-9988-7766",
    impact: [
      "200 siswa kembali mendapatkan akses pendidikan",
      "5 ruang kelas layak pakai",
      "Fasilitas belajar yang memadai"
    ],
    completionDate: "28 Juni 2025"
  },
  {
    id: 6,
    title: "Santunan Anak Yatim",
    category: "Sosial",
    amount: 5200000,
    date: "15 Juni 2025",
    image: "https://images.unsplash.com/photo-1617878227827-8360231f7f03?q=80&w=1256&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Program santunan untuk anak yatim dan dhuafa berupa bantuan pendidikan, kesehatan, dan kebutuhan sehari-hari.",
    details: [
      "Bantuan pendidikan untuk 50 anak",
      "Paket kesehatan dan nutrisi",
      "Bantuan tunai untuk kebutuhan pokok",
      "Kegiatan psikososial dan edukasi"
    ],
    location: "Jakarta Selatan, DKI Jakarta",
    beneficiaries: "50 anak",
    duration: "1 bulan",
    admin: "Yayasan Sayang Anak Indonesia",
    contactPerson: "Ahmad Fauzi - 0858-1234-5678",
    impact: [
      "50 anak mendapatkan bantuan pendidikan",
      "Kesehatan dan nutrisi anak terjaga",
      "Kebutuhan pokok terpenuhi"
    ],
    completionDate: "15 Juni 2025"
  }
];

const Laporan: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");
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

  // Get unique categories
  const categories = ["Semua", ...new Set(reportData.map(report => report.category))];

  // Handle search and filter
  useEffect(() => {
    let filtered = reportData;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(report => report.category === selectedCategory);
    }

    // Sort results
    if (sortBy === "terbaru") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "terlama") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "jumlah-tertinggi") {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "jumlah-terendah") {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    setSearchResults(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle sort
  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Semua");
    setSortBy("terbaru");
  };

  return (
    <div className="laporan-body">
      {/* Navbar */}
      <header className="navbar-container">
        <nav className="navbar">
          <Link to="/" className="navbar-logo">
            Heartify
          </Link>
          <div className="navbar-links">
            <Link to="/beranda">Beranda</Link>
            <Link to="/AboutPage">Tentang Kami</Link>
            <Link to="/profile">Profil</Link>
          </div>
          <Link to="/login" className="navbar-login-button">
            Keluar
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="laporan-hero-section">
        <div className="laporan-hero-content">
          <h1 className="laporan-hero-title">
            Laporan Donasi Tersalurkan
          </h1>
          <p className="laporan-hero-subtitle">
            Bukti nyata setiap kebaikan yang telah Anda berikan. Lihat bagaimana donasi membuat perubahan berarti bagi mereka yang membutuhkan.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="filter-section">
        <div className="filter-container">
          <div className="filter-header">
            <h2>Filter Laporan</h2>
            <div className="sort-container">
              <label htmlFor="sort">Urutkan:</label>
              <select id="sort" value={sortBy} onChange={handleSort} className="sort-select">
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="jumlah-tertinggi">Jumlah Tertinggi</option>
                <option value="jumlah-terendah">Jumlah Terendah</option>
              </select>
            </div>
          </div>

          <div className="search-filter-wrapper">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Cari laporan, lokasi, atau kata kunci..."
                className="search-bar"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm("")}
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-group">
              <div className="filter-subgroup">
                <span className="filter-label">Kategori:</span>
                <div className="category-filters">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(searchTerm || selectedCategory !== "Semua") && (
              <button 
                className="clear-all-filters"
                onClick={clearFilters}
              >
                ⟳ Hapus Semua Filter
              </button>
            )}
          </div>

          <div className="filter-info">
            <p>
              {searchTerm || selectedCategory !== "Semua" ? 
                `Ditemukan ${searchResults.length} laporan dari ${reportData.length} program terselesaikan` : 
                `Menampilkan semua ${reportData.length} laporan program terselesaikan`
              }
            </p>
          </div>
        </div>
      </section>

      {/* Laporan Grid Section */}
      <section className="laporan-grid-section">
        <div className="laporan-container">
          {searchResults.length > 0 ? (
            <div className="laporan-detailed-grid">
              {searchResults.map((report) => (
                <div key={report.id} className="laporan-detailed-card">
                  <div className="laporan-image-container">
                    <img
                      src={report.image}
                      alt={report.title}
                      className="laporan-image"
                    />
                    <div className="card-badges">
                      <span className={`laporan-category-badge laporan-category-${report.category.toLowerCase()}`}>
                        {report.category}
                      </span>
                      <span className="completed-badge">
                        ✅ Selesai
                      </span>
                    </div>
                  </div>
                  
                  <div className="laporan-content">
                    <div className="laporan-header">
                      <div>
                        <h3 className="laporan-title">{report.title}</h3>
                        <p className="laporan-location">📍 {report.location}</p>
                      </div>
                      <p className="laporan-amount">{formatCurrency(report.amount)}</p>
                    </div>
                    
                    <div className="laporan-meta">
                      <div className="meta-item">
                        <span className="meta-label">Tanggal Selesai:</span>
                        <span className="meta-value">{report.completionDate}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Penerima Manfaat:</span>
                        <span className="meta-value">{report.beneficiaries}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Durasi Program:</span>
                        <span className="meta-value">{report.duration}</span>
                      </div>
                    </div>
                    
                    <div className="laporan-description">
                      <p>{report.description}</p>
                    </div>
                    
                    <div className="laporan-details-grid">
                      <div className="detail-column">
                        <h4>Detail Penyaluran</h4>
                        <ul>
                          {report.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="detail-column">
                        <h4>Dampak yang Dicapai</h4>
                        <ul>
                          {report.impact.map((impact, index) => (
                            <li key={index}>{impact}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="laporan-admin-info">
                      <div className="admin-details">
                        <h4>Penanggung Jawab</h4>
                        <p><strong>Organisasi:</strong> {report.admin}</p>
                        <p><strong>Contact Person:</strong> {report.contactPerson}</p>
                      </div>
                    </div>

                    <div className="laporan-actions">
                      <button 
                            className="button button-dark-full"
                            onClick={() => generatePDF(report)}
                        >
                            📥 Unduh Laporan Lengkap
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Tidak ditemukan laporan yang sesuai</h3>
              <p>Coba gunakan kata kunci lain atau sesuaikan filter pencarian</p>
              <button onClick={clearFilters} className="button button-cream">
                ⟳ Tampilkan Semua Laporan
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Laporan;