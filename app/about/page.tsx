"use client";

import Link from "next/link";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* NAVBAR REQUESTED */}
      <div className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">
            Heartify
          </Link>

          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/aboutpage" className="active">
              Tentang Kami
            </Link>
            <Link href="/profile">Profile</Link>
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
            <div className="icon">👁️</div>
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

      {/* TIM KAMI (ZigZag Style sesuai gambar) */}
      <section className="team-section">
        <h2 className="section-title">Tim Hebat Kami</h2>

        {/* Member 1: Maulizar */}
        <div className="team-card left">
          <div className="img-box">
            <img src="/maulizar.jpg" alt="Maulizar" />
          </div>

          <div className="text-box">
            <h3>Maulizar</h3>
            <span className="role">UI/UX Designer</span>
            <p className="desc">
              Mahasiswi Informatika USK. Berfokus pada desain antarmuka yang intuitif dan
              pengalaman pengguna yang nyaman.
            </p>
          </div>
        </div>

        {/* Member 2: Adinda */}
        <div className="team-card right">
          <div className="img-box">
            <img src="/adinda.jpg" alt="Adinda" />
          </div>

          <div className="text-box">
            <h3>Adinda Muarriva</h3>
            <span className="role">Frontend Developer</span>
            <p className="desc">
              Mahasiswi Informatika USK. Pengembang yang berdedikasi menciptakan kode yang
              bersih, efisien, dan responsif.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
