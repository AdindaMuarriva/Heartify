import Link from "next/link";
import "./about.css";

export default function About() {
  return (
    <div className="about-scope-wrapper">
      <header className="navbar-container">
        <nav className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/about" className="active">Tentang Kami</Link>
            <Link href="/profile">Profil</Link>
          </div>
          <Link href="/login" className="navbar-login-button">Keluar</Link>
        </nav>
      </header>
      
      <section className="hero-section">
        <h1 className="hero-title">Tentang Kami</h1>
        <p className="hero-subtitle">
          Platform digital yang mempermudah masyarakat untuk berbagi kebaikan.
        </p>
      </section>

      <section className="mission-section">
        <h2 className="section-title">Visi & Misi</h2>
        <div className="mission-content">
          <div className="mission-box">
            <h3>Visi</h3>
            <p>Menjadi jembatan kebaikan digital.</p>
          </div>
          <div className="mission-box">
            <h3>Misi</h3>
            <ul>
              <li>Mempermudah donasi online.</li>
              <li>Transparansi penyaluran dana.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2 className="section-title">Tim Kami</h2>
        <div className="team-layout">
          {/* Member 1 */}
          <div className="team-card">
            <div className="team-photo">
              <img src="/maulizar.jpg" alt="Maulizar" />
            </div>
            <div className="team-info">
              <h3>Maulizar</h3>
              <p>UI/UX Designer</p>
            </div>
          </div>
          {/* Member 2 */}
          <div className="team-card right">
            <div className="team-photo">
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