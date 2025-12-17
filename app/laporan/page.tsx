"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./laporan.css";
import jsPDF from "jspdf";

// Fungsi generate PDF (sama seperti di React)
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
  doc.text(`Jumlah Donasi: ${formatAmount(report.target)}`, 20, currentY);
  currentY += 6;
  doc.text(`Tanggal Selesai: ${new Date(report.completionDate).toLocaleDateString('id-ID')}`, 20, currentY);
  currentY += 6;
  doc.text(`Penerima Manfaat: ${report.beneficiary}`, 20, currentY);
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

const Laporan = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/laporan");
      const result = await res.json();
      setData(result);
      setSearchResults(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

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
  const categories = ["Semua", ...new Set(data.map(report => report.category))];

  // Handle search and filter
  useEffect(() => {
    if (data.length === 0) return;

    let filtered = [...data];

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
      filtered.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
    } else if (sortBy === "terlama") {
      filtered.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime());
    } else if (sortBy === "jumlah-tertinggi") {
      filtered.sort((a, b) => b.target - a.target);
    } else if (sortBy === "jumlah-terendah") {
      filtered.sort((a, b) => a.target - b.target);
    }

    setSearchResults(filtered);
  }, [searchTerm, selectedCategory, sortBy, data]);

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

  if (loading) {
    return (
      <div className="laporan-body">
        <header className="navbar-container">
          <nav className="navbar">
            <Link href="/" className="navbar-logo">
              Heartify
            </Link>
            <div className="navbar-links">
              <Link href="/beranda">Beranda</Link>
              <Link href="/about">Tentang Kami</Link>
              <Link href="/ajukankampanye">Ajukan Kampanye</Link>
              <Link href="/Profile">Profil</Link>
            </div>
            <Link href="/login" className="navbar-login-button">
              Keluar
            </Link>
          </nav>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="laporan-body">
      {/* Navbar */}
      <header className="navbar-container">
        <nav className="navbar">
          <Link href="/" className="navbar-logo">
            Heartify
          </Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/about">Tentang Kami</Link>
            <Link href="/ajukankampanye">Ajukan Kampanye</Link>
            <Link href="/Profile">Profil</Link>
          </div>
          <Link href="/login" className="navbar-login-button">
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
                `Ditemukan ${searchResults.length} laporan dari ${data.length} program terselesaikan` : 
                `Menampilkan semua ${data.length} laporan program terselesaikan`
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
                <div key={report._id} className="laporan-detailed-card">
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
                      <p className="laporan-amount">{formatCurrency(report.target)}</p>
                    </div>
                    
                    <div className="laporan-meta">
                      <div className="meta-item">
                        <span className="meta-label">Tanggal Selesai:</span>
                        <span className="meta-value">
                          {new Date(report.completionDate).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Penerima Manfaat:</span>
                        <span className="meta-value">{report.beneficiary}</span>
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
                          {report.details.map((detail: string, index: number) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="detail-column">
                        <h4>Dampak yang Dicapai</h4>
                        <ul>
                          {report.impact.map((impact: string, index: number) => (
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