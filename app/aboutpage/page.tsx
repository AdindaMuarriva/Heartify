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
      
      {/* Hero / Header Tentang Kami */}
      <section className="hero-section">
        <h1 className="hero-title">Tentang Kami</h1>
        <p className="hero-subtitle">
          Kami hadir sebagai platform digital yang mempermudah masyarakat
          untuk berbagi kebaikan melalui donasi yang aman, transparan, dan
          berdampak nyata.
        </p>
      </section>

      {/* Visi Misi (Layout Vertikal) */}
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
        <div className="team-layout">
          {/* Member 1 - Kiri */}
          <div className="team-card">
            <div className="team-photo">
              {/* Pastikan file maulizar.jpg ada di public */}
              <img src="/maulizar.jpg" alt="Maulizar" />
            </div>
            <div className="team-info">
              <h3>Maulizar</h3>
              <p>UI/UX Designer</p>
            </div>
          </div>
          {/* Member 2 - Kanan */}
          <div className="team-card right">
            <div className="team-photo">
              {/* Pastikan file adinda.jpg ada di public */}
              <img src="/adinda.jpg" alt="Adinda" />
            </div>
            <div className="team-info">
              <h3>Adinda Muarriva</h3>
              <p>Frontend Developer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}