import Link from "next/link"; // Import komponen Link dari Next.js
import "./about.css"; // Pastikan file CSS ada di folder yang sama

export default function About() {
  return (
    <div className="about-page">
      {/* Navbar */}
      <header className="navbar-container">
        <nav className="navbar">
          {/* Mengganti tag <a> dengan <Link> agar tidak reload halaman */}
          <Link href="/" className="navbar-logo">
            Heartify
          </Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/AboutPage">Tentang Kami</Link>
            <Link href="/profile">Profil</Link>
          </div>
          <Link href="/login" className="navbar-login-button">
            Keluar
          </Link>
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
                {/* Pastikan file gambar ada di folder 'public' */}
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
                {/* Pastikan file gambar ada di folder 'public' */}
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
    </div>
  );
}