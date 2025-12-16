"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./admin.css"; 

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminName, setAdminName] = useState("Admin");

  // === DATA STATES ===
  const [campaignApplications, setCampaignApplications] = useState<any[]>([]); // History Pengajuan
  const [donationHistory, setDonationHistory] = useState<any[]>([]); // Riwayat Donasi
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]); // Kampanye Aktif
  const [reports, setReports] = useState<any[]>([]); // Laporan Penyaluran (Untuk User)

  // === MODAL STATES (BUAT LAPORAN) ===
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: "", 
    category: "Kemanusiaan", 
    amount: "", 
    location: "", 
    completionDate: "",
    beneficiary: "", 
    duration: "", 
    description: "", 
    details: "", 
    impact: "",
    admin: "Yayasan Heartify", 
    contactPerson: "", 
    image: ""
  });
  
  // === STATISTIK DASHBOARD ===
  const [stats, setStats] = useState({
    members: 0,
    totalMoney: 0,
    activePrograms: 0,
    pendingTasks: 0,
    transactionCount: 0,
    distributed: 0
  });

  // === INITIAL LOAD ===
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
    // Ambil database dari LocalStorage
    const apps = JSON.parse(localStorage.getItem("campaignApplications") || "[]");
    const donations = JSON.parse(localStorage.getItem("donationHistory") || "[]");
    const active = JSON.parse(localStorage.getItem("campaignsData") || "[]");
    const savedReports = JSON.parse(localStorage.getItem("reportsData") || "[]");
    
    // Sanitasi data active campaigns (pastikan angka valid)
    const sanitizedActive = active.map((c: any) => ({
      ...c,
      collected: Number(c.collected) || 0,
      distributed: Number(c.distributed) || 0 
    }));

    // Set State
    setCampaignApplications(apps);
    setDonationHistory(donations);
    setActiveCampaigns(sanitizedActive);
    setReports(savedReports);

    // HITUNG STATISTIK REAL-TIME
    const uniqueDonors = new Set(donations.map((d: any) => d.email || "anon")).size;
    const totalUsers = uniqueDonors + 1; // +1 Admin
    const totalCollected = sanitizedActive.reduce((sum: number, c: any) => sum + c.collected, 0);
    const totalDistributed = sanitizedActive.reduce((sum: number, c: any) => sum + c.distributed, 0);
    const pendingAppsCount = apps.filter((a: any) => a.status === "Pending").length;
    const pendingDonationsCount = donations.filter((d: any) => d.status === "pending").length;

    setStats({
      members: totalUsers,
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

  // ==========================================
  // LOGIC 1: APPROVE & REJECT KAMPANYE
  // ==========================================
  const handleApproveCampaign = (app: any) => {
    if(!confirm(`Setujui pengajuan "${app.title}" dari ${app.admin}?`)) return;

    // 1. Update Status di History
    const updatedApps = campaignApplications.map(item => 
      item.id === app.id ? { ...item, status: "Approved" } : item
    );
    localStorage.setItem("campaignApplications", JSON.stringify(updatedApps));

    // 2. Masukkan ke Active Campaigns (Agar muncul di Beranda User)
    const newActiveCampaign = { 
      ...app, 
      id: `camp-${Date.now()}`,
      status: "active", 
      collected: 0, 
      distributed: 0 
    };
    const newActiveList = [...activeCampaigns, newActiveCampaign];
    localStorage.setItem("campaignsData", JSON.stringify(newActiveList));

    alert("Kampanye Disetujui & Ditayangkan!");
    loadData();
  };

  const handleRejectCampaign = (appId: string) => {
    if(!confirm("Tolak pengajuan ini?")) return;
    const updatedApps = campaignApplications.map(item => 
      item.id === appId ? { ...item, status: "Rejected" } : item
    );
    localStorage.setItem("campaignApplications", JSON.stringify(updatedApps));
    alert("Kampanye Ditolak.");
    loadData();
  };

  // ==========================================
  // LOGIC 2: VERIFIKASI DONASI
  // ==========================================
  const handleVerifyDonation = (donation: any) => {
    // 1. Update status donasi jadi success
    const updatedHistory = donationHistory.map(d => d.id === donation.id ? { ...d, status: "success" } : d);
    localStorage.setItem("donationHistory", JSON.stringify(updatedHistory));
    
    // 2. Tambah saldo ke kampanye yang sesuai
    const updatedActive = activeCampaigns.map(c => {
      if (c.title === donation.campaignTitle || c.id === donation.campaignId) {
        return { ...c, collected: (c.collected || 0) + donation.amount };
      }
      return c;
    });
    localStorage.setItem("campaignsData", JSON.stringify(updatedActive));
    alert("Donasi Diverifikasi! Saldo bertambah."); 
    loadData();
  };

  // ==========================================
  // LOGIC 3: HAPUS KAMPANYE AKTIF
  // ==========================================
  const handleDeleteActiveCampaign = (id: string) => {
    if(!confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus data kampanye ini secara permanen? Data yang dihapus tidak dapat dikembalikan.")) return;

    const updatedActive = activeCampaigns.filter(c => c.id !== id);
    localStorage.setItem("campaignsData", JSON.stringify(updatedActive));
    
    alert("Data kampanye berhasil dihapus.");
    loadData(); 
  };

  // ==========================================
  // LOGIC 4: MANAJEMEN LAPORAN (NEW)
  // ==========================================
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport = {
      id: `rep-${Date.now()}`,
      ...reportForm,
      amount: Number(reportForm.amount),
      // Split textarea string menjadi array untuk PDF
      details: reportForm.details.split("\n").filter(item => item.trim() !== ""),
      impact: reportForm.impact.split("\n").filter(item => item.trim() !== ""),
      dateCreated: new Date().toISOString()
    };

    const updatedReports = [newReport, ...reports];
    localStorage.setItem("reportsData", JSON.stringify(updatedReports));
    
    setReports(updatedReports);
    setShowReportModal(false);
    
    // Reset Form
    setReportForm({
      title: "", category: "Kemanusiaan", amount: "", location: "", completionDate: "",
      beneficiary: "", duration: "", description: "", details: "", impact: "",
      admin: "Yayasan Heartify", contactPerson: "", image: ""
    });

    alert("Laporan berhasil diterbitkan! User sekarang bisa melihatnya.");
  };

  const handleDeleteReport = (id: string) => {
    if(!confirm("Hapus laporan ini dari halaman user?")) return;
    const updated = reports.filter(r => r.id !== id);
    localStorage.setItem("reportsData", JSON.stringify(updated));
    setReports(updated);
  };

  // === NAVIGASI TAB ===
  const handleCardClick = (targetTab: string) => {
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-layout">
      {/* === SIDEBAR === */}
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
            {campaignApplications.filter(a => a.status === 'Pending').length > 0 && <span className="badge-count">{campaignApplications.filter(a => a.status === 'Pending').length}</span>}
          </li>
          <li className={`menu-item ${activeTab === 'laporan' ? 'active' : ''}`} onClick={() => setActiveTab('laporan')}>
            <span className="menu-icon">📈</span> Laporan Penyaluran
          </li>
        </ul>
      </aside>

      {/* === MAIN CONTENT === */}
      <div className="main-content">
        {/* TOP NAVBAR */}
        <div className="top-navbar">
          <div className="page-title">{activeTab.replace('-', ' ')}</div>
          <div className="nav-right" style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <span>🔔 {stats.pendingTasks} Pemberitahuan</span>
            <span onClick={handleLogout} style={{color: '#b32820', cursor:'pointer'}}>👤 {adminName} (Logout)</span>
          </div>
        </div>

        <div className="content-wrapper">
          
          {/* =========================================
              VIEW: DASHBOARD (HOME)
             ========================================= */}
          {activeTab === 'dashboard' && (
            <>
              <h2 className="section-title">Ringkasan Sistem</h2>
              {/* Grid 2x2 (Kotak) */}
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

          {/* =========================================
              VIEW: DATA GALANG DANA
             ========================================= */}
          {activeTab === 'galang-dana' && (
            <div className="table-panel">
              <div className="panel-heading">Data Kampanye Aktif</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Judul Kampanye</th>
                      <th>Terkumpul</th>
                      <th>Tersalurkan</th>
                      <th>Sisa Saldo</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCampaigns.length === 0 ? (
                      <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Tidak ada data kampanye aktif.</td></tr>
                    ) : (
                      activeCampaigns.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.title}</strong><br/><small style={{color:'#666'}}>{c.admin}</small></td>
                          <td style={{color:'green', fontWeight:'bold'}}>{formatRupiah(c.collected)}</td>
                          <td style={{color:'#d35400'}}>{formatRupiah(c.distributed)}</td>
                          <td style={{fontWeight:'bold'}}>{formatRupiah(c.collected - c.distributed)}</td>
                          <td>
                            {/* Tombol Hapus */}
                            <button 
                              className="btn-delete" 
                              onClick={() => handleDeleteActiveCampaign(c.id)}
                              title="Hapus Kampanye Ini"
                            >
                              🗑️ Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================
              VIEW: RIWAYAT PENGAJUAN (VERIFIKASI)
             ========================================= */}
          {activeTab === 'verifikasi' && (
            <div className="table-panel">
              <div className="panel-heading">Riwayat Pengajuan Kampanye</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Judul Kampanye</th><th>Target</th><th>Pengaju</th><th>Status</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {campaignApplications.sort((a, b) => (a.status === 'Pending' ? -1 : 1)).map(app => (
                      <tr key={app.id}>
                        <td><strong>{app.title}</strong><br/><small>{app.category}</small></td>
                        <td>{formatRupiah(app.target)}</td>
                        <td>{app.admin}<br/><small>{app.email}</small></td>
                        <td>
                          {app.status === 'Pending' && <span style={{background:'#fef3c7', color:'#d97706', padding:'4px 10px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:'bold'}}>Menunggu</span>}
                          {app.status === 'Approved' && <span style={{background:'#d1fae5', color:'#059669', padding:'4px 10px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:'bold'}}>Disetujui</span>}
                          {app.status === 'Rejected' && <span style={{background:'#fee2e2', color:'#ef4444', padding:'4px 10px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:'bold'}}>Ditolak</span>}
                        </td>
                        <td>
                          {app.status === 'Pending' ? (
                            <>
                              <button className="btn-action btn-approve" onClick={() => handleApproveCampaign(app)}>Setuju</button>
                              <button className="btn-action btn-reject" onClick={() => handleRejectCampaign(app.id)}>Tolak</button>
                            </>
                          ) : <span style={{color: '#888', fontSize: '0.8rem'}}>Selesai</span>}
                        </td>
                      </tr>
                    ))}
                    {campaignApplications.length === 0 && <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Belum ada pengajuan.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================
              VIEW: KONFIRMASI DONASI
             ========================================= */}
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
                          <span style={{
                            padding:'4px 10px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:'bold',
                            background: d.status === 'pending' ? '#fef3c7' : '#d1fae5',
                            color: d.status === 'pending' ? '#d97706' : '#059669'
                          }}>
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

          {/* =========================================
              VIEW: MANAJEMEN LAPORAN (CREATE)
             ========================================= */}
          {activeTab === 'laporan' && (
            <div className="table-panel">
              <div className="panel-heading" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span>Manajemen Laporan Penyaluran (Tampil di User)</span>
                <button className="btn-action" style={{background: '#fff', color: '#3e0703', fontWeight: 'bold'}} onClick={() => setShowReportModal(true)}>
                  + Buat Laporan Baru
                </button>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Judul Program</th><th>Kategori</th><th>Total Dana</th><th>Tgl Selesai</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr><td colSpan={5} style={{textAlign:'center', padding:'20px'}}>Belum ada laporan yang diterbitkan. Klik tombol di atas untuk membuat.</td></tr>
                    ) : (
                      reports.map((r) => (
                        <tr key={r.id}>
                          <td><strong>{r.title}</strong><br/><small>{r.location}</small></td>
                          <td>{r.category}</td>
                          <td>{formatRupiah(r.amount)}</td>
                          <td>{r.completionDate}</td>
                          <td><button className="btn-delete" onClick={() => handleDeleteReport(r.id)}>Hapus</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================
              VIEW: DATA PENGGUNA
             ========================================= */}
          {activeTab === 'users' && (
            <div className="table-panel">
              <div className="panel-heading">Data Pengguna Terdaftar</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>No</th><th>Nama/Email</th><th>Role</th></tr></thead>
                  <tbody>
                    <tr><td>1</td><td>{adminName} (Anda)</td><td><span className="badge-count">Administrator</span></td></tr>
                    {Array.from(new Set([
                        ...donationHistory.map((d:any) => d.email).filter(e => e),
                        ...campaignApplications.map((c:any) => c.email).filter(e => e)
                    ])).map((email, idx) => (
                      <tr key={idx}><td>{idx + 2}</td><td>{email as string}</td><td>User / Donatur</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =======================================================
          MODAL: BUAT LAPORAN BARU (Desain Mewah & Rapi)
         ======================================================= */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {/* Header */}
            <div className="modal-header">
              <div>
                <h3>Buat Laporan Penyaluran</h3>
                <p>Laporan ini akan terbit di halaman User sebagai bukti transparansi.</p>
              </div>
              <button onClick={() => setShowReportModal(false)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleCreateReport}>
              <div className="modal-body">
                <div className="form-grid">
                  
                  {/* Kolom Kiri & Kanan */}
                  <div className="input-group">
                    <label>Judul Program</label>
                    <input type="text" placeholder="Misal: Bantuan Gempa Cianjur" required value={reportForm.title} onChange={e=>setReportForm({...reportForm, title: e.target.value})} />
                  </div>
                  
                  <div className="input-group">
                    <label>Kategori</label>
                    <select value={reportForm.category} onChange={e=>setReportForm({...reportForm, category: e.target.value})}>
                      <option>Kemanusiaan</option>
                      <option>Pendidikan</option>
                      <option>Kesehatan</option>
                      <option>Bencana Alam</option>
                      <option>Rumah Ibadah</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Total Dana Disalurkan (Rp)</label>
                    <input type="number" placeholder="0" required value={reportForm.amount} onChange={e=>setReportForm({...reportForm, amount: e.target.value})} />
                  </div>

                  <div className="input-group">
                    <label>Lokasi Penyaluran</label>
                    <input type="text" placeholder="Kota/Kabupaten" required value={reportForm.location} onChange={e=>setReportForm({...reportForm, location: e.target.value})} />
                  </div>

                  <div className="input-group">
                    <label>Tanggal Selesai</label>
                    <input type="date" required value={reportForm.completionDate} onChange={e=>setReportForm({...reportForm, completionDate: e.target.value})} />
                  </div>

                  <div className="input-group">
                    <label>Penerima Manfaat</label>
                    <input type="text" placeholder="Contoh: 50 KK / 200 Anak Yatim" required value={reportForm.beneficiary} onChange={e=>setReportForm({...reportForm, beneficiary: e.target.value})} />
                  </div>

                  <div className="input-group">
                    <label>Durasi Program</label>
                    <input type="text" placeholder="Contoh: 2 Minggu" required value={reportForm.duration} onChange={e=>setReportForm({...reportForm, duration: e.target.value})} />
                  </div>

                  <div className="input-group">
                    <label>Contact Person (PJ)</label>
                    <input type="text" placeholder="Nama - No.HP" required value={reportForm.contactPerson} onChange={e=>setReportForm({...reportForm, contactPerson: e.target.value})} />
                  </div>

                  {/* Full Width Inputs */}
                  <div className="input-group full-width">
                    <label>URL Gambar Dokumentasi</label>
                    <input type="url" placeholder="https://..." required value={reportForm.image} onChange={e=>setReportForm({...reportForm, image: e.target.value})} />
                  </div>

                  <div className="input-group full-width">
                    <label>Deskripsi Singkat</label>
                    <textarea rows={3} placeholder="Jelaskan secara singkat tentang kegiatan ini..." required value={reportForm.description} onChange={e=>setReportForm({...reportForm, description: e.target.value})}></textarea>
                  </div>

                  <div className="input-group full-width">
                    <label>Rincian Penggunaan Dana (Pisahkan dengan Enter)</label>
                    <textarea rows={4} placeholder="- Pembelian 100 paket sembako&#10;- Biaya logistik&#10;- Santunan tunai" required value={reportForm.details} onChange={e=>setReportForm({...reportForm, details: e.target.value})}></textarea>
                  </div>

                  <div className="input-group full-width">
                    <label>Dampak yang Dihasilkan (Pisahkan dengan Enter)</label>
                    <textarea rows={4} placeholder="- Warga mendapatkan makanan layak&#10;- Anak-anak bisa kembali sekolah" required value={reportForm.impact} onChange={e=>setReportForm({...reportForm, impact: e.target.value})}></textarea>
                  </div>

                </div>
              </div>

              {/* Footer Buttons */}
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowReportModal(false)}>Batal</button>
                <button type="submit" className="btn-submit">🚀 Terbitkan Laporan</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}