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
        <p className="section-description">
          <b>Visi:</b> Menjadi jembatan kebaikan digital yang mendorong
          semangat gotong royong di era teknologi. <br /> <br />
          <b>Misi:</b>
        </p>
        <ul style={{ listStyle: "disc", textAlign: "left", maxWidth: "700px", margin: "0 auto" }}>
          <li>Mempermudah masyarakat untuk berdonasi secara online.</li>
          <li>Memberikan transparansi penuh dalam penyaluran dana.</li>
          <li>Memberdayakan komunitas melalui aksi sosial berkelanjutan.</li>
        </ul>
      </section>

      {/* Cara Kami Bekerja */}
      <section className="work-section">
        <h2 className="section-title">Bagaimana Kami Bekerja</h2>
        <div className="work-grid">
          <div className="work-card">
            <h3 className="work-card-title">1. Donasi</h3>
            <p>Donatur memilih program dan melakukan donasi dengan mudah.</p>
          </div>
          <div className="work-card">
            <h3 className="work-card-title">2. Transparansi</h3>
            <p>Kami memastikan setiap donasi tercatat dan dapat dipantau.</p>
          </div>
          <div className="work-card">
            <h3 className="work-card-title">3. Penyaluran</h3>
            <p>Dana disalurkan tepat sasaran kepada penerima manfaat.</p>
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="testimonial-section">
        <h2 className="section-title">Tim Kami</h2>
        <div className="work-grid">
          <div className="work-card">
            <h3 className="work-card-title">Adinda</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="work-card">
            <h3 className="work-card-title">Maulizar</h3>
            <p>UI/UX Designer</p>
          </div>
        </div>
      </section>
    </div>
  );
}
