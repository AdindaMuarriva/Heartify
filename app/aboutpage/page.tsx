"use client";

import Link from "next/link";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Navbar */}
      <div className="navbar-container">
        <nav className="navbar">
          <Link href="/beranda" className="navbar-logo">
            Heartify
          </Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/aboutpage" className="active">Tentang Kami</Link>
            <Link href="/profile">Profil</Link>
          </div>
          <Link href="/login" className="navbar-login-button">
            Keluar
          </Link>
        </nav>
      </div>
      
      {/* Hero */}
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

      {/* Work Section (3 Grid) */}
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

      {/* Team Section (Zig Zag) */}
      <section className="team-section">
        <h2 className="section-title">Tim Kami</h2>
        <div className="team-horizontal-layout">
          {/* Kiri */}
          <div className="team-member-left">
            <div className="team-card-horizontal">
              <div className="team-photo-container">
                <img src="/maulizar.jpg" alt="Maulizar" className="team-photo" />
              </div>
              <div className="team-content">
                <h3 className="team-name">Maulizar</h3>
                <p className="team-role">UI/UX Designer</p>
                <div className="team-education">
                   <span className="education-icon">🎓</span> Mahasiswi Informatika, Universitas Syiah Kuala
                </div>
              </div>
            </div>
          </div>
          {/* Kanan */}
          <div className="team-member-right">
            <div className="team-card-horizontal">
              <div className="team-photo-container">
                <img src="/adinda.jpg" alt="Adinda" className="team-photo" />
              </div>
              <div className="team-content">
                <h3 className="team-name">Adinda Muarriva</h3>
                <p className="team-role">Frontend Developer</p>
                <div className="team-education">
                   <span className="education-icon">🎓</span> Mahasiswi Informatika, Universitas Syiah Kuala
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}