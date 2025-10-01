import React from "react";
import "./landingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-body">
      {/* Navbar */}
      <header className="navbar-container">
        <nav className="navbar">
          <a href="/" className="navbar-logo">
            Heartify
          </a>
          <div className="navbar-links">
            <a href="/register">Beranda</a>
            <a href="/register">Tentang Kami</a>
            <a href="/register">Profil</a>
          </div>
          <a href="/login" className="navbar-login-button">
            Masuk
          </a>
        </nav>
      </header>

      {/* Hero Section */}
<section className="hero-section">
  <h1 className="hero-title">Raise Your Hand for Humanity</h1>
  <p className="hero-subtitle">
    Heartify adalah platform donasi yang menghubungkan mereka yang peduli dengan sesama yang membutuhkan. 
    Bersama, kita bisa membawa harapan dan menciptakan masa depan yang lebih baik.
  </p>
  <a href="/register" className="button button-cream">Donasi Sekarang</a>
</section>

    {/* Mission Section */}
    <section className="mission-section">
      <h2 className="section-title">Misi Kami</h2>
      <p className="section-description">
        Di <b>Heartify</b>, kami berdedikasi untuk menghadirkan harapan dan perubahan bagi mereka yang sedang berjuang menghadapi kesulitan. 
        Dukungan finansial Anda memungkinkan kami memberikan bantuan langsung dan membuat dampak nyata di kehidupan banyak orang. 
        Setiap donasi, besar maupun kecil, membantu kami terus menjalankan misi ini dan memberdayakan komunitas yang membutuhkan.
      </p>
      <a href="/register" className="button button-dark">Gabung Sekarang</a>
    </section>

    {/* How We Work */}
    <section className="work-section">
      <h2 className="section-title">Amanah Donasi Anda</h2>
      <div className="work-grid">
        <div className="work-card">
          <h3 className="work-card-title">Tepat Sasaran</h3>
          <p>Kami bekerja sama langsung dengan komunitas lokal untuk memastikan setiap bantuan diterima oleh mereka yang paling berhak.</p>
        </div>
        <div className="work-card">
          <h3 className="work-card-title">Proses Transparan</h3>
          <p>Setiap donasi dapat Anda lacak. Kami menjamin semua proses penyaluran dilakukan secara terbuka dan akuntabel.</p>
        </div>
        <div className="work-card">
          <h3 className="work-card-title">Dampak Berkelanjutan</h3>
          <p>Bantuan yang kami salurkan bertujuan untuk menciptakan perubahan jangka panjang, bukan sekadar solusi sementara.</p>
        </div>
      </div>
    </section>


      {/* Testimonials Section */}
      <section className="testimonial-section">
        <h2 className="section-title">Inspirasi Kebaikan</h2>
        <div className="testimonial-card">
          <p className="testimonial-quote">
            “Kita mencari nafkah dengan apa yang kita dapatkan, tetapi kita membangun kehidupan dengan apa yang kita berikan.”
          </p>
          <h4 className="testimonial-author">– Winston Churchill</h4>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          {/* Kolom Tentang */}
          <div className="footer-column footer-about">
            <h3>Tentang Heartify</h3>
            <p>
              Heartify adalah platform donasi yang menghubungkan hati yang baik dengan mereka yang membutuhkan. Bersama, kita bisa menyebarkan harapan.
            </p>
          </div>

    {/* Kolom Kontak */}
    <div className="footer-column">
      <h3>Hubungi Kami</h3>
      <div className="contact-info">
        <a href="mailto:support@heartify.org">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span>support@heartify.org</span>
        </a>
        <br></br>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>+62 822 2222 2223</span>
        </p>
      </div>
    </div>

    {/* Kolom Media Sosial */}
    <div className="footer-column">
      <h3>Ikuti Kami</h3>
      <div className="social-links">
        <a href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          <span>Facebook</span>
        </a>
        <a href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          <span>Instagram</span>
        </a>
      </div>
    </div>
      </div>
      <p className="footer-copyright">
        © 2025 Heartify. Hak cipta dilindungi undang-undang.
      </p>
    </footer>
    </div>
  );
};

export default LandingPage;

