"use client";

import Link from "next/link";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* NAVBAR REQUESTED */}
      <div className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/aboutpage">Tentang Kami</Link>
            <Link href="/Profile">Profile</Link>
          </div>

          <Link href="/login" className="navbar-login-button">
            Keluar
          </Link>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Mewujudkan Kebaikan Bersama</h1>
          <p>
            Platform donasi terpercaya yang menghubungkan niat baik Anda dengan mereka yang
            membutuhkan secara transparan.
          </p>
        </div>
      </section>

      {/* VISI MISI (Vertikal Rapi) */}
      <section className="mission-section">
        <h2 className="section-title">Visi & Misi</h2>

        <div className="mission-cards">
          <div className="mission-card visi">
            <div className="icon">🤝🏻</div>
            <h3>Visi Kami</h3>
            <p>
              Menjadi jembatan kebaikan digital yang memupuk semangat gotong royong di era modern.
            </p>
          </div>

          <div className="mission-card misi">
            <div className="icon">🚀</div>
            <h3>Misi Kami</h3>
            <ul>
              <li>Mempermudah akses donasi secara digital dan aman.</li>
              <li>Menjamin transparansi total dalam setiap penyaluran.</li>
              <li>Memberdayakan komunitas melalui aksi sosial berkelanjutan.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CARA KERJA (Grid) */}
      <section className="work-section">
        <h2 className="section-title">Cara Kerja</h2>

        <div className="work-grid">
          <div className="work-card">
            <div className="num">1</div>
            <h3>Pilih Program</h3>
            <p>Cari kampanye donasi yang menyentuh hati Anda.</p>
          </div>

          <div className="work-card">
            <div className="num">2</div>
            <h3>Donasi Mudah</h3>
            <p>Lakukan pembayaran dengan metode yang aman.</p>
          </div>

          <div className="work-card">
            <div className="num">3</div>
            <h3>Transparan</h3>
            <p>Pantau laporan penyaluran dana secara berkala.</p>
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
    </div>
  );
}