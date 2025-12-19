"use client";
import React, { useState } from "react";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="landing-body">
      {/* Navbar Section */}
      <header className="navbar-header">
        <nav className="navbar container">
          <a href="/" className="navbar-logo">
            Heartify
          </a>

          {/* Hamburger Icon */}
          <div 
            className={`menu-toggle ${isMenuOpen ? "is-active" : ""}`} 
            onClick={toggleMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          {/* Navigation Links & Buttons */}
          <div className={`navbar-menu-wrapper ${isMenuOpen ? "active" : ""}`}>
            <div className="navbar-links">
              <a href={isLoggedIn ? "/" : "/register"} onClick={closeMenu}>Beranda</a>
              <a href={isLoggedIn ? "/AboutPage" : "/register"} onClick={closeMenu}>Tentang</a>
              <a href={isLoggedIn ? "/ajukankampanye" : "/register"} onClick={closeMenu}>Ajukan Kampanye</a>
              <a href={isLoggedIn ? "/profile" : "/register"} onClick={closeMenu}>Profil</a>
            </div>
            
            <div className="navbar-buttons">
              <a href="/login" className="navbar-login-button" onClick={closeMenu}>
                Masuk
              </a>
              <a href="/register" className="navbar-beranda-button" onClick={closeMenu}>
                Daftar
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <h1 className="hero-title">Raise Your Hand for Humanity</h1>
          <p className="hero-subtitle">
            Heartify menghubungkan kebaikan hati Anda dengan mereka yang membutuhkan. 
            Setiap donasi menciptakan dampak berkelanjutan dan membawa harapan baru.
          </p>
          <div className="hero-buttons">
            <a href="/register" className="button button-cream">
              Donasi Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Donatur Aktif</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">250+</div>
              <div className="stat-label">Program Berjalan</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Provinsi Terjangkau</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Kepuasan Donatur</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <h2 className="section-title">Mengapa Memilih Heartify?</h2>
          <p className="section-subtitle">
            Platform donasi modern dengan komitmen penuh terhadap transparansi dan akuntabilitas
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3 className="feature-title">Transparan 100%</h3>
              <p className="feature-description">
                Pantau setiap donasi Anda secara real-time dengan sistem pelacakan yang terintegrasi
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Tepat Sasaran</h3>
              <p className="feature-description">
                Bekerja langsung dengan komunitas lokal untuk memastikan bantuan sampai yang paling membutuhkan
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Laporan Detail</h3>
              <p className="feature-description">
                Terima laporan lengkap tentang dampak donasi Anda dengan foto dan cerita nyata
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonial-section section">
        <div className="container">
          <h2 className="section-title">Apa Kata Mereka?</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Sebagai donatur, saya sangat menghargai transparansi Heartify. Bisa melihat langsung dampak donasi saya membuat saya yakin untuk terus berbagi."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AS</div>
                <div className="author-info">
                  <h4>Ahmad Santoso</h4>
                  <p>Donatur Rutin</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Bantuan dari Heartify mengubah hidup komunitas kami. Sekolah darurat yang dibangun memberi anak-anak kami harapan baru."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <h4>Sari Mulyani</h4>
                  <p>Penerima Manfaat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column footer-about">
              <h3>Tentang Heartify</h3>
              <p>
                Heartify adalah platform donasi digital yang menghubungkan kebaikan hati dengan mereka yang membutuhkan. 
                Dengan teknologi dan transparansi, kami wujudkan perubahan berkelanjutan.
              </p>
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

            <div className="footer-column footer-contact-section">
              <h3>Kontak</h3>
              <div className="contact-info">
                <a href="mailto:support@heartify.org" className="contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>support@heartify.org</span>
                </a>
                <div className="contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+62 822 2222 2223</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2025 Heartify. Hak cipta dilindungi undang-undang.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;