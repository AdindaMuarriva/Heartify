import "./about.css";

export default function About() {

  return (
    <div className="about-page">
        {/* Navbar */}
      <header className="navbar-container">
        <nav className="navbar">
          <a href="/" className="navbar-logo">
            Heartify
          </a>
          <div className="navbar-links">
            <a href="/beranda">Beranda</a>
            <a href="/AboutPage">Tentang Kami</a>
            <a href="/profile">Profil</a>
          </div>
          <a href="/login" className="navbar-login-button">
            Keluar
          </a>
        </nav>
      </header>

      {/* Hero / Header Tentang Kami */}
      <section className="hero-section">
        <h1 className="hero-title">Tentang Kami</h1>
        <p className="hero-subtitle">
          Kami hadir sebagai platform digital yang mempermudah masyarakat
          untuk berbagi kebaikan melalui donasi yang aman, transparan, dan
          berdampak nyata.
        </p>
      </section>

      {/* Visi Misi */}
      <section className="mission-section">
        <h2 className="section-title">Visi & Misi</h2>
        <div className="mission-content">
          <div className="vision-box">
            <h3>Visi</h3>
            <p>Menjadi jembatan kebaikan digital yang mendorong semangat gotong royong di era teknologi.</p>
          </div>
          <div className="mission-box">
            <h3>Misi</h3>
            <ul>
              <li>Mempermudah masyarakat untuk berdonasi secara online.</li>
              <li>Memberikan transparansi penuh dalam penyaluran dana.</li>
              <li>Memberdayakan komunitas melalui aksi sosial berkelanjutan.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cara Kami Bekerja */}
      <section className="work-section">
        <h2 className="section-title">Bagaimana Kami Bekerja</h2>
        <div className="work-grid">
          <div className="work-card">
            <div className="work-number">1</div>
            <h3 className="work-card-title">Donasi</h3>
            <p>Donatur memilih program dan melakukan donasi dengan mudah.</p>
          </div>
          <div className="work-card">
            <div className="work-number">2</div>
            <h3 className="work-card-title">Transparansi</h3>
            <p>Kami memastikan setiap donasi tercatat dan dapat dipantau.</p>
          </div>
          <div className="work-card">
            <div className="work-number">3</div>
            <h3 className="work-card-title">Penyaluran</h3>
            <p>Dana disalurkan tepat sasaran kepada penerima manfaat.</p>
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="team-section">
        <h2 className="section-title">Tim Kami</h2>
        <div className="team-horizontal-layout">
          {/* Maulizar - Kiri */}
          <div className="team-member-left">
            <div className="team-card-horizontal">
              <div className="team-photo-container">
                <img src="/maulizar.jpg" alt="Maulizar" className="team-photo" />
              </div>
              <div className="team-content">
                <h3 className="team-name">Maulizar</h3>
                <p className="team-role">UI/UX Designer</p>
                <div className="team-education">
                  <span className="education-icon">🎓</span>
                  Mahasiswi Informatika, Universitas Syiah Kuala
                </div>
                <div className="team-bio">
                  <p>Mendesain pengalaman pengguna yang intuitif dan antarmuka yang menarik. Fokus pada desain yang accessible dan user-centered untuk memastikan platform mudah digunakan semua kalangan. Berpengalaman dalam menciptakan solusi desain yang tidak hanya indah secara visual tetapi juga fungsional dan mudah dipahami.</p>
                </div>
                <div className="team-details">
                  <div className="detail-item">
                    <span className="detail-label">Spesialisasi:</span>
                    <span className="detail-value">UI Design, UX Research, Prototyping</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tools:</span>
                    <span className="detail-value">Figma, Adobe XD, Illustrator</span>
                  </div>
                </div>
                <div className="team-skills">
                  <span className="skill-tag">Figma</span>
                  <span className="skill-tag">User Research</span>
                  <span className="skill-tag">Wireframing</span>
                  <span className="skill-tag">Prototyping</span>
                  <span className="skill-tag">UI Design</span>
                </div>
              </div>
            </div>
          </div>

          {/* Adinda Muarriva - Kanan */}
          <div className="team-member-right">
            <div className="team-card-horizontal">
              <div className="team-photo-container">
                <img src="/adinda.jpg" alt="Adinda Muarriva" className="team-photo" />
              </div>
              <div className="team-content">
                <h3 className="team-name">Adinda Muarriva</h3>
                <p className="team-role">Frontend Developer</p>
                <div className="team-education">
                  <span className="education-icon">🎓</span>
                  Mahasiswi Informatika, Universitas Syiah Kuala
                </div>
                <div className="team-bio">
                  <p>Bertanggung jawab dalam pengembangan antarmuka pengguna yang responsif dan interaktif. Memastikan pengalaman donasi yang seamless dan mudah digunakan oleh semua pengguna. Memiliki passion dalam menciptakan kode yang bersih, efisien, dan maintainable untuk aplikasi web modern.</p>
                </div>
                <div className="team-details">
                  <div className="detail-item">
                    <span className="detail-label">Spesialisasi:</span>
                    <span className="detail-value">Frontend Development, React, Responsive Design</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tools:</span>
                    <span className="detail-value">VS Code, Git, Chrome DevTools</span>
                  </div>
                </div>
                <div className="team-skills">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">CSS</span>
                  <span className="skill-tag">HTML</span>
                  <span className="skill-tag">Git</span>
                  <span className="skill-tag">Responsive Design</span>
                </div>
              </div>
            </div>
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
}