"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./admin-dashboard.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminName, setAdminName] = useState("Admin");

  // === DATA STATES ===
  const [campaignApplications, setCampaignApplications] = useState<any[]>([]); // Master History Pengajuan
  const [donationHistory, setDonationHistory] = useState<any[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]); // Kampanye yang TAYANG di Beranda
  
  // Statistik
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
    if (!userStr) { router.push("/login"); return; }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") { router.push("/beranda"); return; }
    setAdminName(user.name);

    // 2. Load Data
    loadData();
  }, [router]);

  const loadData = () => {
    // Ambil semua database
    const apps = JSON.parse(localStorage.getItem("campaignApplications") || "[]");
    const donations = JSON.parse(localStorage.getItem("donationHistory") || "[]");
    const active = JSON.parse(localStorage.getItem("campaignsData") || "[]");
    
    // Sanitasi data active campaigns
    const sanitizedActive = active.map((c: any) => ({
      ...c,
      collected: Number(c.collected) || 0,
      distributed: Number(c.distributed) || 0 
    }));

    setCampaignApplications(apps);
    setDonationHistory(donations);
    setActiveCampaigns(sanitizedActive);

    // HITUNG STATISTIK (Real-time Calculation)
    const uniqueDonors = new Set(donations.map((d: any) => d.email || "anon")).size;
    
    // Hitung total dana dari kampanye aktif
    const totalCollected = sanitizedActive.reduce((sum: number, c: any) => sum + c.collected, 0);
    const totalDistributed = sanitizedActive.reduce((sum: number, c: any) => sum + c.distributed, 0);
    
    // Hitung pending tasks (Donasi pending + Pengajuan pending)
    const pendingAppsCount = apps.filter((a: any) => a.status === "Pending").length;
    const pendingDonationsCount = donations.filter((d: any) => d.status === "pending").length;

    setStats({
      members: uniqueDonors + 1, // +1 Admin
      totalMoney: totalCollected,
      activePrograms: sanitizedActive.length,
      pendingTasks: pendingAppsCount + pendingDonationsCount,
      transactionCount: donations.length,
      distributed: totalDistributed
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // === LOGIC BARU: APPROVE KAMPANYE (Dengan History) ===
  const handleApproveCampaign = (app: any) => {
    if(!confirm(`Setujui pengajuan "${app.title}" dari ${app.admin}?`)) return;

    // 1. Update Status di Master List Pengajuan (History)
    const updatedApps = campaignApplications.map(item => 
      item.id === app.id ? { ...item, status: "Approved" } : item
    );
    localStorage.setItem("campaignApplications", JSON.stringify(updatedApps));

    // 2. Masukkan ke Active Campaigns (Agar muncul di Beranda User)
    // Buat ID baru untuk public display atau gunakan ID pengajuan
    const newActiveCampaign = { 
      ...app, 
      id: `camp-${Date.now()}`, // ID baru untuk sistem donasi
      status: "active", 
      collected: 0, 
      distributed: 0 
    };
    const newActiveList = [...activeCampaigns, newActiveCampaign];
    localStorage.setItem("campaignsData", JSON.stringify(newActiveList));

    // 3. Notifikasi ke User (Opsional, simpan ke localStorage notifikasi)
    // createNotification(app.email, "Disetujui", ...)

    alert("Kampanye Disetujui & Ditayangkan!");
    loadData();
  };

  // === LOGIC BARU: REJECT KAMPANYE ===
  const handleRejectCampaign = (appId: string) => {
    if(!confirm("Tolak pengajuan ini?")) return;

    // Hanya update status di History, JANGAN DIHAPUS
    const updatedApps = campaignApplications.map(item => 
      item.id === appId ? { ...item, status: "Rejected" } : item
    );
    localStorage.setItem("campaignApplications", JSON.stringify(updatedApps));

    alert("Kampanye Ditolak.");
    loadData();
  };

  // === LOGIC: VERIFIKASI DONASI ===
  const handleVerifyDonation = (donation: any) => {
    // Update status donasi
    const updatedHistory = donationHistory.map(d => d.id === donation.id ? { ...d, status: "success" } : d);
    localStorage.setItem("donationHistory", JSON.stringify(updatedHistory));
    
    // Tambah saldo ke kampanye yang sesuai
    const updatedActive = activeCampaigns.map(c => {
      if (c.title === donation.campaignTitle || c.id === donation.campaignId) {
        return { ...c, collected: (c.collected || 0) + donation.amount };
      }
      return c;
    });
    localStorage.setItem("campaignsData", JSON.stringify(updatedActive));
    
    alert("Donasi Diverifikasi!"); 
    loadData();
  };

  // Tab Handler dengan Scroll Top
  const handleCardClick = (targetTab: string) => {
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <span className="menu-icon">📝</span> Riwayat Pengajuan
            {/* Hitung yang statusnya Pending saja untuk badge */}
            {campaignApplications.filter(a => a.status === 'Pending').length > 0 && <span className="badge-count">{campaignApplications.filter(a => a.status === 'Pending').length}</span>}
          </li>
          <li className={`menu-item ${activeTab === 'laporan' ? 'active' : ''}`} onClick={() => setActiveTab('laporan')}>
            <span className="menu-icon">📈</span> Laporan Penyaluran
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="top-navbar">
          <div className="page-title">{activeTab.replace('-', ' ')}</div>
          <div className="nav-right">
            <span>🔔 {stats.pendingTasks} Pemberitahuan</span>
            <span onClick={handleLogout} style={{color: '#b32820', cursor:'pointer'}}>👤 {adminName} (Logout)</span>
          </div>
        </div>

        <div className="content-wrapper">
          
          {/* === DASHBOARD VIEW === */}
          {activeTab === 'dashboard' && (
            <>
              <h2 className="section-title">Ringkasan Sistem</h2>
              {/* Grid 2x2 Sesuai Permintaan */}
              <div className="stats-row-1">
                {/* 1. Anggota */}
                <div className="stat-card-solid bg-gradient-1">
                  <div className="stat-body">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.members}</span>
                      <span className="stat-label">ANGGOTA TERDAFTAR</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('users')}>Lihat Detail Data Pengguna ➔</div>
                </div>

                {/* 2. Kampanye Aktif */}
                <div className="stat-card-solid bg-gradient-2">
                  <div className="stat-body">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.activePrograms}</span>
                      <span className="stat-label">KAMPANYE AKTIF</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('galang-dana')}>Lihat Detail Kampanye ➔</div>
                </div>

                {/* 3. Menunggu Aksi */}
                <div className="stat-card-solid bg-gradient-3">
                  <div className="stat-body">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.pendingTasks}</span>
                      <span className="stat-label">MENUNGGU AKSI</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('verifikasi')}>Cek Pengajuan & Donasi ➔</div>
                </div>

                {/* 4. Total Dana */}
                <div className="stat-card-solid bg-gradient-4">
                  <div className="stat-body">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <span className="stat-number" style={{fontSize: '1.8rem'}}>{formatRupiah(stats.totalMoney)}</span>
                      <span className="stat-label">TOTAL DANA MASUK</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleCardClick('laporan')}>Lihat Laporan Keuangan ➔</div>
                </div>
              </div>

              <h2 className="section-title">Statistik Aktivitas</h2>
              <div className="stats-row-2">
                <div className="stat-card-light">
                  <div className="light-body">
                    <div className="light-icon-box icon-yellow">🤝</div>
                    <div className="light-info">
                      <span className="light-number">{stats.transactionCount}</span>
                      <span className="light-label">Total Transaksi</span>
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
                  <div className="light-footer" onClick={() => handleCardClick('laporan')}>Lihat Detail ➔</div>
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

          {/* === VERIFIKASI (HISTORY PENGAJUAN) VIEW === */}
          {activeTab === 'verifikasi' && (
            <div className="table-panel">
              <div className="panel-heading">Riwayat Pengajuan Kampanye (History Lengkap)</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Judul Kampanye</th><th>Target</th><th>Pengaju</th><th>Status</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {/* Urutkan yang Pending di paling atas */}
                    {campaignApplications
                      .sort((a, b) => (a.status === 'Pending' ? -1 : 1))
                      .map(app => (
                      <tr key={app.id}>
                        <td>
                          <strong>{app.title}</strong><br/>
                          <small>{app.category}</small>
                        </td>
                        <td>{formatRupiah(app.target)}</td>
                        <td>{app.admin}<br/><small>{app.email}</small></td>
                        <td>
                          {app.status === 'Pending' && <span className="status-pill pending">Menunggu</span>}
                          {app.status === 'Approved' && <span className="status-pill success">Disetujui</span>}
                          {app.status === 'Rejected' && <span className="status-pill rejected" style={{background:'#e74c3c', color:'white'}}>Ditolak</span>}
                        </td>
                        <td>
                          {/* Tombol hanya muncul jika status masih Pending */}
                          {app.status === 'Pending' ? (
                            <>
                              <button className="btn-action btn-approve" onClick={() => handleApproveCampaign(app)}>Setuju</button>
                              <button className="btn-action btn-reject" onClick={() => handleRejectCampaign(app.id)}>Tolak</button>
                            </>
                          ) : (
                            <span style={{color: '#888', fontSize: '0.8rem'}}>Selesai</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {campaignApplications.length === 0 && <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Belum ada pengajuan.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === KONFIRMASI DONASI VIEW === */}
          {activeTab === 'konfirmasi' && (
            <div className="table-panel">
              <div className="panel-heading">Daftar Donasi Masuk</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Donatur</th><th>Kampanye</th><th>Jumlah</th><th>Status</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {donationHistory.map(d => (
                      <tr key={d.id}>
                        <td>{d.isAnonymous ? "Hamba Allah" : "User"}<br/><small>{d.provider}</small></td>
                        <td>{d.campaignTitle}</td>
                        <td><strong>{formatRupiah(d.amount)}</strong></td>
                        <td>
                          <span className={`status-pill ${d.status === 'pending' ? 'pending' : 'success'}`}>
                            {d.status === 'pending' ? 'Menunggu' : 'Berhasil'}
                          </span>
                        </td>
                        <td>
                          {d.status === 'pending' && (
                            <button className="btn-action btn-verify" onClick={() => handleVerifyDonation(d)}>Verifikasi</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === DATA USER VIEW === */}
          {activeTab === 'users' && (
            <div className="table-panel">
              <div className="panel-heading">Data Pengguna Terdaftar</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>No</th><th>Nama/Email</th><th>Role</th></tr></thead>
                  <tbody>
                    <tr><td>1</td><td>{adminName} (Anda)</td><td><span className="badge-count">Admin Utama</span></td></tr>
                    {/* List user unik dari history donasi atau pengajuan */}
                    {Array.from(new Set([
                        ...donationHistory.map((d:any) => d.email).filter(e => e),
                        ...campaignApplications.map((c:any) => c.email).filter(e => e)
                    ])).map((email, idx) => (
                      <tr key={idx}>
                        <td>{idx + 2}</td>
                        <td>{email as string}</td>
                        <td>User / Donatur</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === GALANG DANA VIEW (ACTIVE) === */}
          {activeTab === 'galang-dana' && (
            <div className="table-panel">
              <div className="panel-heading">Data Kampanye Aktif</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Kampanye</th><th>Terkumpul</th><th>Tersalurkan</th><th>Sisa Saldo</th></tr></thead>
                  <tbody>
                    {activeCampaigns.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.title}</strong><br/><small>{c.admin}</small></td>
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