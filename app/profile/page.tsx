"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./profile.css";

export default function Profile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Tab State untuk Profile
  const [activeTab, setActiveTab] = useState("info"); // 'info' or 'notifications'

  const [form, setForm] = useState({
    name: "", email: "", photo: "", oldPass: "", newPass: "", confirmPass: "",
  });

  useEffect(() => {
    // 1. Load User
    const data = localStorage.getItem("registeredUser");
    if (!data) { router.push("/login"); return; }
    const parsed = JSON.parse(data);
    setUser(parsed);
    setForm((p) => ({ ...p, name: parsed.name, email: parsed.email, photo: parsed.photo || "" }));

    // 2. Load Notifications
    const allNotifs = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    // Filter notifikasi hanya untuk email user ini
    const myNotifs = allNotifs.filter((n: any) => n.email === parsed.email);
    setNotifications(myNotifs);

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newUser = { ...user, name: form.name, email: form.email, photo: form.photo };
    localStorage.setItem("registeredUser", JSON.stringify(newUser));
    setUser(newUser);
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setForm((p) => ({ ...p, photo: reader.result as string }));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (!user) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-page">
      {/* NAVBAR */}
      <div className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/about">Tentang Kami</Link>
            <Link href="/ajukankampanye">Ajukan Kampanye</Link>
            <Link href="/profile" className="active">Profile</Link>
          </div>
          <button onClick={handleLogout} className="navbar-login-button">Keluar</button>
        </div>
      </div>

      <div className="profile-container">
        <h1>Dashboard Donatur</h1>

        <div className="profile-dashboard">
          {/* SIDEBAR */}
          <aside className="profile-sidebar">
            <div className="photo-wrapper" onClick={() => isEditing && fileInputRef.current?.click()}>
              <img src={form.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b1c15&color=fff`} className="avatar" alt="avatar" />
              {isEditing && <div className="photo-overlay">📸</div>}
            </div>
            <input type="file" ref={fileInputRef} hidden onChange={handleFile} />
            <div className="user-info">
              <h2>{user.name}</h2>
              <p>Donatur Aktif</p>
            </div>
            
            {/* Menu Navigasi Profile */}
            <div style={{width: '100%', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button 
                onClick={() => setActiveTab('info')}
                style={{
                  padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'info' ? '#3e0703' : 'transparent',
                  color: activeTab === 'info' ? 'white' : '#3e0703', fontWeight: 'bold'
                }}
              >
                👤 Data Diri
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                style={{
                  padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'notifications' ? '#3e0703' : 'transparent',
                  color: activeTab === 'notifications' ? 'white' : '#3e0703', fontWeight: 'bold'
                }}
              >
                🔔 Notifikasi {notifications.length > 0 && `(${notifications.length})`}
              </button>
            </div>

            <button className="btn-logout-side" onClick={handleLogout}>Log Out</button>
          </aside>

          {/* MAIN CONTENT */}
          <main className="profile-main">
            
            {/* TAB: INFO PRIBADI */}
            {activeTab === 'info' && (
              <>
                <div className="main-header">
                  <h3>Informasi Pribadi</h3>
                  {!isEditing && <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profil</button>}
                </div>
                <form className="profile-form" onSubmit={handleSave}>
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" value={form.name} disabled={!isEditing} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} disabled={!isEditing} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  {isEditing && (
                    <div className="form-actions">
                      <button type="submit" className="btn-save">Simpan Perubahan</button>
                      <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Batal</button>
                    </div>
                  )}
                </form>
              </>
            )}

            {/* TAB: NOTIFIKASI */}
            {activeTab === 'notifications' && (
              <>
                <div className="main-header">
                  <h3>Kotak Masuk Notifikasi</h3>
                </div>
                <div className="notif-list" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  {notifications.length === 0 ? (
                    <p style={{color: '#888', textAlign: 'center', padding: '20px'}}>Belum ada notifikasi baru.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} style={{
                        padding: '15px', borderRadius: '8px',
                        background: notif.type === 'success' ? '#d1fae5' : notif.type === 'error' ? '#fee2e2' : '#f3f4f6',
                        borderLeft: `5px solid ${notif.type === 'success' ? '#10b981' : notif.type === 'error' ? '#ef4444' : '#3e0703'}`
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                          <strong style={{color: '#333'}}>{notif.title}</strong>
                          <small style={{color: '#666'}}>{notif.date}</small>
                        </div>
                        <p style={{margin: 0, fontSize: '0.9rem', color: '#444'}}>{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}