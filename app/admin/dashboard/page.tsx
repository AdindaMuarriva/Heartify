// app/admin/dashboard/page.tsx - MOBILE OPTIMIZED
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";

// Tipe data untuk statistik
type Stats = {
  members: number;
  totalMoney: number;
  activePrograms: number;
  pendingTasks: number;
  transactionCount: number;
  distributed: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // === DATA STATES ===
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [donationHistory, setDonationHistory] = useState<any[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // === STATS STATE ===
  const [stats, setStats] = useState<Stats>({
    members: 0,
    totalMoney: 0,
    activePrograms: 0,
    pendingTasks: 0,
    transactionCount: 0,
    distributed: 0
  });

  // --- Autentikasi dan Load Data Awal ---
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      router.push("/login"); 
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      
      if (user.role !== "admin") {
        router.push("/beranda");
      } else {
        setAdminName(user.name);
        loadData(); 
      }
    
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/login");
    }
  }, [router]);

  // --- Fungsi Load Data dari API ---
  const loadData = async () => {
    setDataLoadError(null);
    setLoading(true);
    
    try {
      // Fetch data dari 5 API 
      const [campaignsRes, donationsRes, pendingRes, usersCountRes, allUsersRes] = await Promise.all([
        fetch("/api/campaign/all"), 
        fetch("/api/donations"),    
        fetch("/api/campaign/pending"),
        fetch("/api/users/count"), 
        fetch("/api/users/all")
      ]);

      // Cek status respons
      if (!campaignsRes.ok || !donationsRes.ok || !pendingRes.ok || !usersCountRes.ok || !allUsersRes.ok) {
        let errorMsg = "Gagal mengambil data dari API. Status:";
        if (!campaignsRes.ok) errorMsg += ` Campaigns(${campaignsRes.status})`;
        if (!donationsRes.ok) errorMsg += ` Donations(${donationsRes.status})`;
        if (!usersCountRes.ok) errorMsg += ` UsersCount(${usersCountRes.status})`;
        if (!allUsersRes.ok) errorMsg += ` AllUsers(${allUsersRes.status})`;
        
        throw new Error(errorMsg);
      }

      // Parse JSON
      const campaigns = await campaignsRes.json();
      const donations = await donationsRes.json();
      const usersData = await usersCountRes.json(); 
      const usersList = await allUsersRes.json();
      
      // Filter data
      const approvedCampaigns = campaigns.filter((c: any) => c.status === "approved");
      const pendingCampaigns = campaigns.filter((c: any) => c.status === "pending");

      setPendingCampaigns(pendingCampaigns);
      setDonationHistory(donations);
      setActiveCampaigns(approvedCampaigns);
      setAllUsers(usersList);

      // Hitung statistik
      const totalCollected = approvedCampaigns.reduce((sum: number, c: any) => sum + (c.collected || 0), 0);
      const pendingDonationsCount = donations.filter((d: any) => d.status === 'pending').length;
      
      const totalUsers = usersData.count || 0; 

      setStats({
        members: totalUsers,
        totalMoney: totalCollected,
        activePrograms: approvedCampaigns.length,
        pendingTasks: pendingCampaigns.length + pendingDonationsCount,
        transactionCount: donations.length,
        distributed: 0 
      });

    } catch (error: any) {
      console.error("Error loading data:", error);
      setDataLoadError(`Gagal memuat data: ${error.message}. Cek konsol server.`);
      // Reset states jika gagal
      setPendingCampaigns([]);
      setDonationHistory([]);
      setActiveCampaigns([]);
      setAllUsers([]);
      setStats({ members: 0, totalMoney: 0, activePrograms: 0, pendingTasks: 0, transactionCount: 0, distributed: 0 });
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleApproveCampaign = async (campaign: any) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: campaign._id })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Campaign "${campaign.title}" berhasil disetujui!`);
        loadData(); 
      } else {
        alert(`❌ Gagal: ${data.error || data.message}`);
      }
    } catch (error: any) {
      console.error("Approve error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleRejectCampaign = async (campaign: any) => {
    if (!confirm(`Tolak campaign "${campaign.title}"?`)) return;
    
    try {
      const response = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: campaign._id })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Campaign ditolak`);
        loadData();
      } else {
        alert(`❌ Gagal: ${data.error || data.message}`);
      }
    } catch (error: any) {
      console.error("Reject error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleVerifyDonation = async (donation: any) => {
    try {
      const response = await fetch("/api/admin/verify-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: donation._id })
      });

      const data = await response.json();
      
      if (data.success) {
        alert("✅ Donasi berhasil diverifikasi!");
        loadData();
      } else {
        alert(`❌ Gagal: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Verify donation error:", error);
      alert("Gagal memverifikasi donasi");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Helper Format
  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");
  const formatDate = (dateString: string | Date) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when tab is clicked
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      setMobileMenuOpen(false);
    }
  };

  // === RENDER ===
  if (loading) {
    return (
      <div className="admin-layout">
        <div className="loading-container">
          <div>Loading admin data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR / MOBILE NAVBAR */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">HEARTIFY ADMIN</div>
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`} 
            onClick={() => handleTabClick("dashboard")}
          >
            <span className="menu-icon">📊</span>
            <span className="menu-text">Dashboard</span>
          </li>
          <li 
            className={`menu-item ${activeTab === "users" ? "active" : ""}`} 
            onClick={() => handleTabClick("users")}
          >
            <span className="menu-icon">👥</span>
            <span className="menu-text">Data Pengguna</span>
          </li>
          <li 
            className={`menu-item ${activeTab === "galang-dana" ? "active" : ""}`} 
            onClick={() => handleTabClick("galang-dana")}
          >
            <span className="menu-icon">🎁</span>
            <span className="menu-text">Data Galang Dana</span>
          </li>
          <li 
            className={`menu-item ${activeTab === "konfirmasi" ? "active" : ""}`} 
            onClick={() => handleTabClick("konfirmasi")}
          >
            <span className="menu-icon">💰</span>
            <span className="menu-text">Konfirmasi Donasi</span>
            {donationHistory.filter((d: any) => d.status === "pending").length > 0 && (
              <span className="badge-count">
                {donationHistory.filter((d: any) => d.status === "pending").length}
              </span>
            )}
          </li>
          <li 
            className={`menu-item ${activeTab === "verifikasi" ? "active" : ""}`} 
            onClick={() => handleTabClick("verifikasi")}
          >
            <span className="menu-icon">📝</span>
            <span className="menu-text">Verifikasi Kampanye</span>
            {pendingCampaigns.length > 0 && (
              <span className="badge-count">{pendingCampaigns.length}</span>
            )}
          </li>
          <li 
            className={`menu-item ${activeTab === "laporan" ? "active" : ""}`} 
            onClick={() => handleTabClick("laporan")}
          >
            <span className="menu-icon">📈</span>
            <span className="menu-text">Laporan Penyaluran</span>
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
            <span className="notification-badge">
              <span className="bell-icon">🔔</span> 
              <span className="notification-count">{stats.pendingTasks}</span>
              <span className="notification-text">Pemberitahuan</span>
            </span>
            <span onClick={handleLogout} className="admin-profile">
              <span className="profile-icon">👤</span> 
              <span className="admin-name">{adminName}</span>
              <span className="logout-text">(Logout)</span>
            </span>
          </div>
        </div>

        <div className="content-wrapper">
          {/* ERROR MESSAGE DISPLAY */}
          {dataLoadError && (
            <div className="error-alert">
              ⚠️ <strong>ERROR MEMUAT DATA:</strong> {dataLoadError}
            </div>
          )}

          {/* === VIEW: DASHBOARD === */}
          {activeTab === 'dashboard' && (
            <>
              <h2 className="section-title">Ringkasan Sistem</h2>
              <div className="stats-row-1">
                <div className="stat-card-solid bg-gradient-1">
                  <div className="stat-body">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.members}</span>
                      <span className="stat-label">Anggota Terdaftar</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleTabClick('users')}>
                    Lihat Detail Data Pengguna <span className="arrow">➔</span>
                  </div>
                </div>

                <div className="stat-card-solid bg-gradient-2">
                  <div className="stat-body">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.activePrograms}</span>
                      <span className="stat-label">Kampanye Aktif</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleTabClick('galang-dana')}>
                    Lihat Detail Kampanye <span className="arrow">➔</span>
                  </div>
                </div>

                <div className="stat-card-solid bg-gradient-3">
                  <div className="stat-body">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                      <span className="stat-number">{stats.pendingTasks}</span>
                      <span className="stat-label">Menunggu Aksi</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleTabClick('verifikasi')}>
                    Cek Verifikasi Kampanye <span className="arrow">➔</span>
                  </div>
                </div>

                <div className="stat-card-solid bg-gradient-4">
                  <div className="stat-body">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <span className="stat-number amount-number">
                        {formatRupiah(stats.totalMoney)}
                      </span>
                      <span className="stat-label">Total Dana Masuk</span>
                    </div>
                  </div>
                  <div className="stat-footer" onClick={() => handleTabClick('laporan')}>
                    Lihat Laporan Keuangan <span className="arrow">➔</span>
                  </div>
                </div>
              </div>

              {/* Stat Cards Row 2 */}
              <h2 className="section-title">Statistik Lainnya</h2>
              <div className="stats-row-2">
                <div className="stat-card-light">
                  <div className="light-body">
                    <div className="light-icon-box icon-yellow">
                      💸
                    </div>
                    <div className="light-info">
                      <span className="light-number">{stats.transactionCount}</span>
                      <span className="light-label">Total Transaksi</span>
                    </div>
                  </div>
                  <div className="light-footer" onClick={() => handleTabClick('laporan')}>
                    Lihat Transaksi <span className="arrow">➔</span>
                  </div>
                </div>

                <div className="stat-card-light">
                  <div className="light-body">
                    <div className="light-icon-box icon-blue">
                      📊
                    </div>
                    <div className="light-info">
                      <span className="light-number">{stats.distributed}</span>
                      <span className="light-label">Dana Disalurkan</span>
                    </div>
                  </div>
                  <div className="light-footer">
                    Buat Laporan <span className="arrow">➔</span>
                  </div>
                </div>

                <div className="stat-card-light">
                  <div className="light-body">
                    <div className="light-icon-box icon-purple">
                      ⚡
                    </div>
                    <div className="light-info">
                      <span className="light-number">{pendingCampaigns.length}</span>
                      <span className="light-label">Campaign Pending</span>
                    </div>
                  </div>
                  <div className="light-footer" onClick={() => handleTabClick('verifikasi')}>
                    Verifikasi Sekarang <span className="arrow">➔</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* === VIEW: DATA PENGGUNA === */}
          {activeTab === 'users' && (
            <div className="table-panel">
              <div className="panel-heading">Daftar Semua Pengguna ({stats.members} Total)</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Tanggal Daftar</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-state">
                          Tidak ada data pengguna.
                        </td>
                      </tr>
                    ) : (
                      allUsers.map((user) => (
                        <tr key={user._id}>
                          <td><strong>{user.name}</strong></td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role?.toUpperCase() || 'USER'}
                            </span>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <button className="btn-action btn-danger">Hapus</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === VIEW: VERIFIKASI KAMPANYE === */}
          {activeTab === 'verifikasi' && (
            <div className="table-panel">
              <div className="panel-heading">Daftar Pengajuan Kampanye Baru ({pendingCampaigns.length})</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Target</th>
                      <th>Pengaju</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-state">
                          Tidak ada pengajuan kampanye baru.
                        </td>
                      </tr>
                    ) : (
                      pendingCampaigns.map((campaign) => (
                        <tr key={campaign._id}>
                          <td>
                            <strong>{campaign.title}</strong>
                            <div className="campaign-id">
                              ID: {campaign._id?.substring(0, 8)}...
                            </div>
                          </td>
                          <td>{campaign.category}</td>
                          <td>{formatRupiah(campaign.target)}</td>
                          <td>{campaign.admin || "User"}</td>
                          <td>
                            {campaign.createdAt ? formatDate(campaign.createdAt) : "-"}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-action btn-approve" 
                                onClick={() => handleApproveCampaign(campaign)}
                              >
                                Setuju
                              </button>
                              <button 
                                className="btn-action btn-reject" 
                                onClick={() => handleRejectCampaign(campaign)}
                              >
                                Tolak
                              </button>
                            </div>
                            <div className="secondary-actions">
                              <button 
                                className="btn-action btn-preview"
                                onClick={() => window.open(`/informasi/${campaign._id}`, '_blank')}
                              >
                                Preview
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Quick Actions */}
              <div className="quick-actions">
                <button
                  onClick={() => {
                    if (confirm("Approve semua campaign pending?")) {
                      fetch("/api/admin/approve-all")
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            alert(`✅ ${data.modifiedCount} campaign disetujui`);
                            loadData();
                          } else {
                            alert(`❌ Gagal: ${data.error || data.message}`);
                          }
                        });
                    }
                  }}
                  className="btn-action btn-approve btn-large"
                >
                  Approve Semua
                </button>
                
                <button
                  onClick={loadData}
                  className="btn-action btn-secondary btn-large"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}

          {/* === VIEW: DATA GALANG DANA === */}
          {activeTab === 'galang-dana' && (
            <div className="table-panel">
              <div className="panel-heading">Data Kampanye Aktif ({activeCampaigns.length})</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Judul Kampanye</th>
                      <th>Target</th>
                      <th>Terkumpul</th>
                      <th>Progress</th>
                      <th>Batas Waktu</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-state">
                          Belum ada kampanye aktif. Silakan approve campaign di tab Verifikasi.
                        </td>
                      </tr>
                    ) : (
                      activeCampaigns.map((campaign) => {
                        const progress = campaign.target > 0 
                          ? ((campaign.collected || 0) / campaign.target * 100).toFixed(1)
                          : 0;
                        
                        return (
                          <tr key={campaign._id}>
                            <td>
                              <strong>{campaign.title}</strong>
                              <div className="campaign-meta">
                                {campaign.category} • {campaign.location}
                              </div>
                            </td>
                            <td>{formatRupiah(campaign.target)}</td>
                            <td className="amount-collected">
                              {formatRupiah(campaign.collected || 0)}
                            </td>
                            <td>
                              <div className="progress-container">
                                <div className="progress-bar">
                                  <div 
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <span className="progress-text">{progress}%</span>
                              </div>
                            </td>
                            <td>
                              {campaign.deadline 
                                ? formatDate(campaign.deadline)
                                : "-"
                              }
                            </td>
                            <td>
                              <button
                                className="btn-action btn-view"
                                onClick={() => window.open(`/informasi/${campaign._id}`, '_blank')}
                              >
                                Lihat
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === VIEW: KONFIRMASI DONASI === */}
          {activeTab === 'konfirmasi' && (
            <div className="table-panel">
              <div className="panel-heading">Konfirmasi Donasi Pending ({donationHistory.filter((d: any) => d.status === "pending").length} Total)</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Donatur</th>
                      <th>Campaign</th>
                      <th>Jumlah</th>
                      <th>Metode</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.filter((d: any) => d.status === "pending").length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-state">
                          Tidak ada donasi yang perlu dikonfirmasi.
                        </td>
                      </tr>
                    ) : (
                      donationHistory
                        .filter((d: any) => d.status === "pending")
                        .map((donation) => (
                          <tr key={donation._id}>
                            <td><strong>{donation.donorName || 'Anonim'}</strong></td>
                            <td>{donation.campaignId?.title || 'N/A'}</td>
                            <td className="amount-collected">{formatRupiah(donation.amount)}</td>
                            <td>{donation.paymentMethod || 'Transfer Bank'}</td>
                            <td>{formatDate(donation.createdAt)}</td>
                            <td>
                              <button
                                className="btn-action btn-verify"
                                onClick={() => handleVerifyDonation(donation)}
                              >
                                Verifikasi
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

          {/* === VIEW: RIWAYAT DONASI LENGKAP === */}
          {activeTab === 'laporan' && (
            <div className="table-panel">
              <div className="panel-heading">Riwayat Semua Transaksi Donasi ({donationHistory.length} Total)</div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Donatur</th>
                      <th>Campaign</th>
                      <th>Jumlah</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-state">
                          Belum ada riwayat donasi.
                        </td>
                      </tr>
                    ) : (
                      donationHistory.map((donation) => {
                        const statusClass = donation.status === 'verified' ? 'status-verified' : 
                                          donation.status === 'pending' ? 'status-pending' : 'status-rejected';
                        
                        return (
                          <tr key={donation._id}>
                            <td>{donation.donorName || 'Anonim'}</td>
                            <td>{donation.campaignId?.title || 'N/A'}</td>
                            <td className="amount-collected">{formatRupiah(donation.amount)}</td>
                            <td>
                              <span className={`status-badge ${statusClass}`}>
                                {donation.status}
                              </span>
                            </td>
                            <td>{formatDate(donation.createdAt)}</td>
                          </tr>
                        );
                      })
                    )}
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