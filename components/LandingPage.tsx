// landingPage.tsx
"use client";
import { useRouter } from "next/navigation";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  
  const isLoggedIn = false;
  
  return (
    <div className="landing-body">
      {/* Navbar */}
      <header className="navbar-container">
        <nav className="navbar container">
          <a href="/" className="navbar-logo">
            Heartify
          </a>
          <div className="navbar-links">
            <a href={isLoggedIn ? "/" : "/register"}>Beranda</a>
            <a href={isLoggedIn ? "/AboutPage" : "/register"}>Tentang</a>
            <a href={isLoggedIn ? "/profile" : "/register"}>Profil</a>
          </div>
          <div className="navbar-buttons">
            <a href="/login" className="navbar-login-button">
              Masuk
            </a>
            <a href="/beranda" className="navbar-beranda-button">
              Daftar
            </a>
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
          <br></br>
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
          <p className="section-subtitle">
            Cerita inspiratif dari donatur dan penerima manfaat Heartify
          </p>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Sebagai donatur, saya sangat menghargai transparansi Heartify. Bisa melihat langsung 
                dampak donasi saya membuat saya yakin untuk terus berbagi."
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
                "Bantuan dari Heartify mengubah hidup komunitas kami. Sekolah darurat yang dibangun 
                memberi anak-anak kami harapan baru untuk masa depan."
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Siap Berbuat Kebaikan?</h2>
          <p className="cta-subtitle">
            Bergabunglah dengan ribuan donatur lainnya dan jadilah bagian dari perubahan positif
          </p>
          <div className="cta-buttons">
            <a href="/register" className="button button-cream">
              Mulai Donasi
            </a>
          </div>
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

export default LandingPage;