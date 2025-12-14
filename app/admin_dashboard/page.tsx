"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [adminName, setAdminName] = useState("Admin");

  // === DATA STATES ===
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [donationHistory, setDonationHistory] = useState<any[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState(0);

  // === STATS STATE ===
  const [stats, setStats] = useState({
    members: 0,
    totalMoney: 0,
    activePrograms: 0,
    pendingTasks: 0,
    transactionCount: 0,
    distributed: 0
  });

  useEffect(() => {
    // 1. Cek Login Admin
    const userStr = localStorage.getItem("registeredUser");
    if (!userStr) {
      router.push("/login"); return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      router.push("/beranda"); return;
    }
    setAdminName(user.name);

    // 2. Load Data Real
    loadData();
  }, [router]);

  const loadData = () => {
    const pending = JSON.parse(localStorage.getItem("pendingCampaigns") || "[]");
    const donations = JSON.parse(localStorage.getItem("donationHistory") || "[]");
    const campaigns = JSON.parse(localStorage.getItem("campaignsData") || "[]");
    
    // Sanitasi data
    const sanitizedCampaigns = campaigns.map((c: any) => ({
      ...c,
      collected: Number(c.collected) || 0,
      distributed: Number(c.distributed) || 0 
    }));

    setPendingCampaigns(pending);
    setDonationHistory(donations);
    setActiveCampaigns(sanitizedCampaigns);

    // Hitung User Unik (Simulasi) + Admin
    const uniqueDonors = new Set(donations.map((d: any) => d.email || "anon")).size;
    const totalUsers = uniqueDonors + 1;
    setUsersCount(totalUsers);

    // Hitung Statistik
    const totalCollected = sanitizedCampaigns.reduce((sum: number, c: any) => sum + c.collected, 0);
    const totalDistributed = sanitizedCampaigns.reduce((sum: number, c: any) => sum + c.distributed, 0);
    const pendingCount = pending.length + donations.filter((d: any) => d.status === 'pending').length;

    setStats({
      members: totalUsers,
      totalMoney: totalCollected,
      activePrograms: sanitizedCampaigns.length,
      pendingTasks: pendingCount,
      transactionCount: donations.length,
      distributed: totalDistributed
    });
  };

  // === NAVIGASI KARTU ===
  const handleCardClick = (targetTab: string) => {
    setActiveTab(targetTab);
    // Scroll ke atas saat pindah tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // === ACTIONS ===
  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  // Helper Format
  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // Logic Verifikasi dll (sama seperti sebelumnya, disingkat agar fokus layout)
  const handleVerifyDonation = (donation: any) => {
    const updatedHistory = donationHistory.map(d => d.id === donation.id ? { ...d, status: "success" } : d);
    localStorage.setItem("donationHistory", JSON.stringify(updatedHistory));
    
    const updatedCampaigns = activeCampaigns.map(c => {
      if (c.title === donation.campaignTitle || c.id === donation.campaignId) {
        return { ...c, collected: (c.collected || 0) + donation.amount };
      }
      return c;
    });
    localStorage.setItem("campaignsData", JSON.stringify(updatedCampaigns));
    alert("Donasi Diverifikasi!"); loadData();
  };

  const handleApproveCampaign = (campaign: any) => {
    const newActive = [...activeCampaigns, { ...campaign, status: "active", id: Date.now().toString(), collected: 0, distributed: 0 }];
    const newPending = pendingCampaigns.filter(c => c.id !== campaign.id);
    localStorage.setItem("campaignsData", JSON.stringify(newActive));
    localStorage.setItem("pendingCampaigns", JSON.stringify(newPending));
    alert("Kampanye Disetujui!"); loadData();
  };

  const handleRejectCampaign = (id: string) => {
    if(!confirm("Tolak?")) return;
    const newPending = pendingCampaigns.filter(c => c.id !== id);
    localStorage.setItem("pendingCampaigns", JSON.stringify(newPending));
    loadData();
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">HEARTIFY ADMIN</div>
        </div>
        <ul className="sidebar-menu">
          <li className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="menu-icon">📊</span> Dashboard
          </li>
          <li className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <span className="menu-icon">👥</span> Data Pengguna
          </li>
          <li className={`menu-item ${activeTab === 'galang-dana' ? 'active' : ''}`} onClick={() => setActiveTab('galang-dana')}>
            <span className="menu-icon">🎁</span> Data Galang Dana
          </li>
          <li className={`menu-item ${activeTab === 'konfirmasi' ? 'active' : ''}`} onClick={() => setActiveTab('konfirmasi')}>
            <span className="menu-icon">💰</span> Konfirmasi Donasi
            {donationHistory.filter(d => d.status === 'pending').length > 0 && <span className="badge-count">{donationHistory.filter(d => d.status === 'pending').length}</span>}
          </li>
          <li className={`menu-item ${activeTab === 'verifikasi' ? 'active' : ''}`} onClick={() => setActiveTab('verifikasi')}>
            <span className="menu-icon">📝</span> Verifikasi Kampanye
            {pendingCampaigns.length > 0 && <span className="badge-count">{pendingCampaigns.length}</span>}
          </li>
          <li className={`menu-item ${activeTab === 'laporan' ? 'active' : ''}`} onClick={() => setActiveTab('laporan')}>
            <span className="menu-icon">📈</span> Laporan Penyaluran
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="top-navbar">
          <div className="page-title">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : 
             activeTab === 'galang-dana' ? 'Data Galang Dana' :
             activeTab === 'users' ? 'Data Pengguna' :
             activeTab === 'konfirmasi' ? 'Konfirmasi Donasi' :
             activeTab === 'verifikasi' ? 'Verifikasi Kampanye' : 'Laporan'}
          </div>
          <div className="nav-right">
            <span>🔔 {stats.pendingTasks} Pemberitahuan</span>
            <span onClick={handleLogout} style={{color: '#b32820'}}>👤 {adminName} (Logout)</span>
          </div>
        </div>

        <div className="content-wrapper">
          
          {/* === VIEW: DASHBOARD === */}
          {activeTab === 'dashboard' && (
            <>
              {/* SECTION 1: RINGKASAN DONASI (Solid Cards) */}
              <h2 className="section-title">Ringkasan Sistem</h2>
              <div className="stats-row-1">
                {/* 1. ANGGOTA */}
                <div className="stat-card-solid bg-gradient-1">
                  <div className="stat-body">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.members}</span>
                      <span className="stat-label">Anggota Terdaftar</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('users')}>
                    Lihat Detail Data Pengguna ➔
                  </div>
                </div>

                {/* 2. KAMPANYE AKTIF */}
                <div className="stat-card-solid bg-gradient-2">
                  <div className="stat-body">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.activePrograms}</span>
                      <span className="stat-label">Kampanye Aktif</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('galang-dana')}>
                    Lihat Detail Kampanye ➔
                  </div>
                </div>

                {/* 3. MENUNGGU AKSI */}
                <div className="stat-card-solid bg-gradient-3">
                  <div className="stat-body">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.pendingTasks}</span>
                      <span className="stat-label">Menunggu Aksi</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('konfirmasi')}>
                    Cek Konfirmasi & Verifikasi ➔
                  </div>
                </div>

                {/* 4. TOTAL DANA */}
                <div className="stat-card-solid bg-gradient-4">
                  <div className="stat-body">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <span className="stat-number" style={{fontSize: '1.8rem'}}>{formatRupiah(stats.totalMoney)}</span>
                      <span className="stat-label">Total Dana Masuk</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('laporan')}>
                    Lihat Laporan Keuangan ➔
                  </div>
                </div>
              </div>

              {/* SECTION 2: STATISTIK GALANG DANA (Light Cards) */}
              <h2 className="section-title">Statistik Aktivitas</h2>
              <div className="stats-row-2">
                <div className="stat-card-light">
                  <div className="light-body">
                    <div className="light-icon-box icon-yellow">🤝</div>
                    <div className="light-info">
                      <span className="light-number">{stats.transactionCount}</span>
                      <span className="light-label">Total Transaksi Donasi</span>
                    </div>
                  </div>
                  <div className="light-footer" onClick={() => handleCardClick('konfirmasi')}>Lihat Detail ➔</div>
                </div>

                <div className="stat-card-light">
                  <div className="light-body">
                    <div className="light-icon-box icon-blue">📤</div>
                    <div className="light-info">
                      <span className="light-number">{formatRupiah(stats.distributed)}</span>
                      <span className="light-label">Dana Tersalurkan</span>
                    </div>
                  </div>
                  <div className="light-footer" onClick={() => handleCardClick('galang-dana')}>Lihat Detail ➔</div>
                </div>

                <div className="stat-card-light">
                  <div className="light-body">
                    <div className="light-icon-box icon-purple">🏛️</div>
                    <div className="light-info">
                      <span className="light-number">{stats.activePrograms}</span>
                      <span className="light-label">Jumlah Program</span>
                    </div>
                  </div>
                  <div className="light-footer" onClick={() => handleCardClick('galang-dana')}>Lihat Detail ➔</div>
                </div>
              </div>
            </>
          )}

          {/* === VIEW: DATA PENGGUNA (NEW) === */}
          {activeTab === 'users' && (
            <div className="table-panel">
              <div className="panel-heading">Daftar Pengguna / Donatur (Estimasi dari Transaksi)</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>No</th><th>User / Email</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td>1</td><td>Admin Heartify</td><td><span className="badge-count">Administrator</span></td></tr>
                    {Array.from(new Set(donationHistory.map((d:any) => d.email || "Donatur Anonim"))).map((email, idx) => (
                      <tr key={idx}>
                        <td>{idx + 2}</td>
                        <td>{email as string}</td>
                        <td>User Aktif</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === VIEW: KONFIRMASI DONASI === */}
          {activeTab === 'konfirmasi' && (
            <div className="table-panel">
              <div className="panel-heading">Daftar Donasi Menunggu Konfirmasi</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Donatur</th><th>Kampanye</th><th>Jumlah</th><th>Metode</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {donationHistory.filter(d => d.status === 'pending').map(d => (
                      <tr key={d.id}>
                        <td>{d.isAnonymous ? "Hamba Allah" : "User"}</td>
                        <td>{d.campaignTitle}</td>
                        <td><strong>{formatRupiah(d.amount)}</strong></td>
                        <td>{d.provider}</td>
                        <td><button className="btn-action btn-verify" onClick={() => handleVerifyDonation(d)}>Verifikasi</button></td>
                      </tr>
                    ))}
                    {donationHistory.filter(d => d.status === 'pending').length === 0 && <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Tidak ada data pending.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === VIEW: VERIFIKASI KAMPANYE === */}
          {activeTab === 'verifikasi' && (
            <div className="table-panel">
              <div className="panel-heading">Daftar Pengajuan Kampanye Baru</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Judul</th><th>Kategori</th><th>Target</th><th>Pengaju</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {pendingCampaigns.map(c => (
                      <tr key={c.id}>
                        <td>{c.title}</td>
                        <td>{c.category}</td>
                        <td>{formatRupiah(c.target)}</td>
                        <td>{c.admin}</td>
                        <td>
                          <button className="btn-action btn-approve" onClick={() => handleApproveCampaign(c)}>Setuju</button>
                          <button className="btn-action btn-reject" onClick={() => handleRejectCampaign(c.id)}>Tolak</button>
                        </td>
                      </tr>
                    ))}
                    {pendingCampaigns.length === 0 && <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Tidak ada pengajuan baru.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === VIEW: GALANG DANA === */}
          {activeTab === 'galang-dana' && (
            <div className="table-panel">
              <div className="panel-heading">Data Kampanye Aktif & Penyaluran</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Judul Kampanye</th><th>Terkumpul</th><th>Tersalurkan</th><th>Sisa Saldo</th></tr></thead>
                  <tbody>
                    {activeCampaigns.map(c => (
                      <tr key={c.id}>
                        <td>{c.title}</td>
                        <td style={{color:'green'}}>{formatRupiah(c.collected)}</td>
                        <td style={{color:'#d35400'}}>{formatRupiah(c.distributed)}</td>
                        <td style={{fontWeight:'bold'}}>{formatRupiah(c.collected - c.distributed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}