"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";

// Helper untuk format rupiah
const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminName, setAdminName] = useState("Admin");

  // === DATA STATES ===
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [donationHistory, setDonationHistory] = useState<any[]>([]);
  
  // === MODAL STATES ===
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    // 1. Cek Auth Admin
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
    setPendingCampaigns(JSON.parse(localStorage.getItem("pendingCampaigns") || "[]"));
    setDonationHistory(JSON.parse(localStorage.getItem("donationHistory") || "[]"));
    const campaigns = JSON.parse(localStorage.getItem("campaignsData") || "[]");
    
    // Pastikan data memiliki field yang dibutuhkan
    const sanitized = campaigns.map((c: any) => ({
      ...c,
      collected: c.collected || 0,
      distributed: c.distributed || 0 
    }));
    setActiveCampaigns(sanitized);
  };

  // === SISTEM NOTIFIKASI ===
  const createNotification = (emailUser: string, title: string, message: string, type: "success" | "error" | "info") => {
    const allNotifs = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    const newNotif = {
      id: Date.now(),
      email: emailUser, // Target user
      title,
      message,
      type,
      date: new Date().toLocaleDateString("id-ID"),
      isRead: false
    };
    allNotifs.unshift(newNotif);
    localStorage.setItem("userNotifications", JSON.stringify(allNotifs));
  };

  // === LOGIC: KAMPANYE ===
  const handleApprove = (campaign: any) => {
    if(!confirm(`Setujui kampanye "${campaign.title}"?`)) return;

    // 1. Pindahkan ke Active
    const newActive = [...activeCampaigns, { ...campaign, status: "active", id: Date.now().toString(), collected: 0, distributed: 0 }];
    const newPending = pendingCampaigns.filter(c => c.id !== campaign.id);

    localStorage.setItem("campaignsData", JSON.stringify(newActive));
    localStorage.setItem("pendingCampaigns", JSON.stringify(newPending));

    // 2. Kirim Notifikasi ke User
    createNotification(
      campaign.email, 
      "Kampanye Disetujui! 🎉", 
      `Selamat! Kampanye "${campaign.title}" telah disetujui admin dan sekarang tayang di halaman publik.`,
      "success"
    );

    loadData();
  };

  const openRejectModal = (campaign: any) => {
    setSelectedItem(campaign);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason) return alert("Alasan penolakan harus diisi!");

    // 1. Hapus dari Pending
    const newPending = pendingCampaigns.filter(c => c.id !== selectedItem.id);
    localStorage.setItem("pendingCampaigns", JSON.stringify(newPending));

    // 2. Kirim Notifikasi ke User
    createNotification(
      selectedItem.email, 
      "Kampanye Ditolak ⚠️", 
      `Maaf, kampanye "${selectedItem.title}" ditolak. Alasan: ${rejectReason}`,
      "error"
    );

    setShowRejectModal(false);
    loadData();
  };

  // === LOGIC: DONASI ===
  const openVerifyModal = (donation: any) => {
    setSelectedItem(donation);
    setShowVerifyModal(true);
  };

  const handleVerifyConfirm = () => {
    // 1. Update Status Donasi
    const updatedHistory = donationHistory.map(d => 
      d.id === selectedItem.id ? { ...d, status: "success" } : d
    );
    localStorage.setItem("donationHistory", JSON.stringify(updatedHistory));

    // 2. Tambah Saldo Kampanye
    const updatedCampaigns = activeCampaigns.map(c => {
      if (c.title === selectedItem.campaignTitle || c.id === selectedItem.campaignId) {
        return { ...c, collected: (c.collected || 0) + selectedItem.amount };
      }
      return c;
    });
    localStorage.setItem("campaignsData", JSON.stringify(updatedCampaigns));

    // 3. Kirim Notifikasi ke Donatur (Jika User login)
    // Asumsi: Kita bisa ambil email dari user session saat donasi, 
    // tapi karena struktur donasi mungkin belum simpan email, kita skip atau gunakan dummy jika ada.
    // Di sini kita anggap donasi anonim jika tidak ada email, tapi jika ada:
    if (selectedItem.email) { 
       // Note: Pastikan saat user donasi, emailnya ikut tersimpan di donationHistory
       createNotification(
         selectedItem.email,
         "Donasi Diterima! ❤️",
         `Terima kasih! Donasi sebesar ${formatRupiah(selectedItem.amount)} untuk "${selectedItem.campaignTitle}" telah kami terima.`,
         "success"
       );
    }

    setShowVerifyModal(false);
    loadData();
  };

  // Stats
  const totalCollected = activeCampaigns.reduce((sum, c) => sum + c.collected, 0);
  const totalDistributed = activeCampaigns.reduce((sum, c) => sum + c.distributed, 0);

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">Heartify</div>
          <span className="admin-badge">ADMIN</span>
        </div>
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span>📊 Dashboard</span>
          </button>
          <button className={`menu-item ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>
            <span>📝 Validasi Kampanye</span>
            {pendingCampaigns.length > 0 && <span className="notif-bubble">{pendingCampaigns.length}</span>}
          </button>
          <button className={`menu-item ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
            <span>💰 Verifikasi Donasi</span>
            {donationHistory.filter(d => d.status === 'pending').length > 0 && 
              <span className="notif-bubble">{donationHistory.filter(d => d.status === 'pending').length}</span>
            }
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => { localStorage.removeItem("registeredUser"); router.push("/login"); }}>
            Keluar
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="main-content">
        <header className="header-bar">
          <div className="header-title">
            <h1>Halo, {adminName} 👋</h1>
            <p>Kelola ekosistem Heartify dengan bijak.</p>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">Total Donasi</div>
                <div className="stat-value">{formatRupiah(totalCollected)}</div>
                <div className="stat-desc">Akumulasi seluruh kampanye</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Tersalurkan</div>
                <div className="stat-value" style={{color: '#10b981'}}>{formatRupiah(totalDistributed)}</div>
                <div className="stat-desc">Dana sampai ke penerima</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Kampanye Aktif</div>
                <div className="stat-value">{activeCampaigns.length}</div>
                <div className="stat-desc">Program berjalan</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Pending Action</div>
                <div className="stat-value" style={{color: '#d35400'}}>
                  {pendingCampaigns.length + donationHistory.filter(d => d.status === 'pending').length}
                </div>
                <div className="stat-desc">Tugas menunggu</div>
              </div>
            </div>
            
            <div className="content-section">
              <div className="section-header">
                 <h3>Aktivitas Terbaru</h3>
              </div>
              <p style={{color: '#666'}}>Silakan pilih menu di samping untuk melakukan validasi.</p>
            </div>
          </>
        )}

        {activeTab === 'campaigns' && (
          <div className="content-section">
            <div className="section-header"><h3>Permintaan Kampanye Baru</h3></div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead><tr><th>Kampanye</th><th>Target</th><th>Pengaju</th><th>Aksi</th></tr></thead>
                <tbody>
                  {pendingCampaigns.length === 0 ? <tr><td colSpan={4} style={{textAlign:'center'}}>Tidak ada data</td></tr> : 
                    pendingCampaigns.map(c => (
                      <tr key={c.id}>
                        <td>
                          <div className="campaign-info">
                            <img src={c.image} alt="" className="campaign-thumb"/>
                            <div><strong>{c.title}</strong><br/><small>{c.category}</small></div>
                          </div>
                        </td>
                        <td>{formatRupiah(c.target)}</td>
                        <td>{c.admin}</td>
                        <td>
                          <button className="action-btn btn-accept" onClick={() => handleApprove(c)}>✓</button>
                          <button className="action-btn btn-reject" onClick={() => openRejectModal(c)}>✕</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="content-section">
            <div className="section-header"><h3>Verifikasi Donasi Masuk</h3></div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead><tr><th>Donatur</th><th>Tujuan</th><th>Jumlah</th><th>Status</th><th>Aksi</th></tr></thead>
                <tbody>
                  {donationHistory.map(d => (
                    <tr key={d.id}>
                      <td>{d.isAnonymous ? "Hamba Allah" : "User"}<br/><small>{d.provider}</small></td>
                      <td>{d.campaignTitle}</td>
                      <td><strong>{formatRupiah(d.amount)}</strong></td>
                      <td><span className={`status-pill ${d.status}`}>{d.status}</span></td>
                      <td>
                        {d.status === 'pending' && (
                          <button className="action-btn btn-check" onClick={() => openVerifyModal(d)}>Cek Bukti</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL REJECT */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Tolak Kampanye</h3>
            <p>Berikan alasan penolakan untuk notifikasi ke user:</p>
            <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Contoh: Deskripsi kurang jelas, foto tidak valid, dll."></textarea>
            <div className="modal-actions">
              <button className="action-btn" style={{background:'#eee', color:'#333'}} onClick={() => setShowRejectModal(false)}>Batal</button>
              <button className="action-btn btn-reject" onClick={handleRejectConfirm}>Tolak Kampanye</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VERIFY DONATION */}
      {showVerifyModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Verifikasi Bukti Transfer</h3>
            <p><strong>Donatur:</strong> {selectedItem.isAnonymous ? "Anonim" : "User"}</p>
            <p><strong>Jumlah:</strong> {formatRupiah(selectedItem.amount)}</p>
            
            {/* Simulasi Gambar Bukti (Karena file input user tidak tersimpan di server nyata dalam demo ini, kita pakai placeholder jika null) */}
            <div style={{background: '#f9f9f9', padding: '10px', textAlign: 'center', marginBottom: '10px'}}>
               {selectedItem.proofUploaded ? 
                  <p style={{color:'green'}}>📄 File Bukti Tersedia (Simulasi View)</p> 
                  : <p style={{color:'red'}}>Tidak ada bukti upload</p>
               }
            </div>

            <div className="modal-actions">
              <button className="action-btn" style={{background:'#eee', color:'#333'}} onClick={() => setShowVerifyModal(false)}>Tutup</button>
              <button className="action-btn btn-accept" onClick={handleVerifyConfirm}>Verifikasi Valid</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}