"use client";

import Link from "next/link";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* NAVBAR */}
      <div className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/aboutpage">Tentang Kami</Link>
            <Link href="/profile">Profile</Link>
          </div>
          <Link href="/login" className="navbar-login-button">Keluar</Link>
        </div>
      </div>
      
      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">Tentang Kami</h1>
        <p className="hero-subtitle">
          Kami hadir sebagai platform digital yang mempermudah masyarakat untuk berbagi kebaikan melalui donasi yang aman dan transparan.
        </p>
      </section>

      {/* Visi Misi (Vertikal) */}
      <section className="mission-section">
        <div className="mission-content">
          <div className="vision-box">
            <h3>Visi</h3>
            <p>Menjadi jembatan kebaikan digital yang mendorong semangat gotong royong.</p>
          </div>
          <div className="mission-box">
            <h3>Misi</h3>
            <ul>
              <li>Mempermudah donasi secara online.</li>
              <li>Memberikan transparansi penuh.</li>
              <li>Memberdayakan komunitas sosial.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tim (ZigZag) */}
      <section className="team-section">
        <h2 className="section-title">Tim Kami</h2>
        <div className="team-horizontal-layout">
          {/* Kiri */}
          <div className="team-member-left">
            <div className="team-card-horizontal">
              <div className="team-photo-container">
                <img src="/maulizar.jpg" alt="Maulizar" className="team-photo"/>
              </div>
              <div className="team-content">
                <h3>Maulizar</h3>
                <p>UI/UX Designer</p>
              </div>
            </div>
          </div>
          {/* Kanan */}
          <div className="team-member-right">
            <div className="team-card-horizontal">
              <div className="team-photo-container">
                <img src="/adinda.jpg" alt="Adinda" className="team-photo"/>
              </div>
              <div className="team-content">
                <h3>Adinda Muarriva</h3>
                <p>Frontend Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}