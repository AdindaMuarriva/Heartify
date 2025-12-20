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
  const [activeTab, setActiveTab] = useState("info"); // 'info' or 'notifications'

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  useEffect(() => {
    // 1. Load User
    const data = localStorage.getItem("user");
    if (!data) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(data);
    
    // Redirect Admin ke Dashboard Admin
    if (parsed.role === "admin") {
      router.push("/admin");
      return;
    }

    setUser(parsed);
    setForm((p) => ({
      ...p,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || "",
      bio: parsed.bio || "",
      photo: parsed.photo || "",
    }));

    // 2. Load Notifications
    const allNotifs = JSON.parse(localStorage.getItem("userNotifications") || "[]");
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
    
    // Validasi Password
    let finalPass = user.password;
    if(form.newPass) {
        if(form.newPass !== form.confirmPass) return alert("Konfirmasi password tidak cocok");
        if(form.oldPass !== user.password) return alert("Password lama salah");
        finalPass = form.newPass;
    }

    const newUser = {
      ...user,
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      password: finalPass,
      photo: form.photo,
    };
    
    localStorage.setItem("registeredUser", JSON.stringify(newUser));
    setUser(newUser);
    setIsEditing(false);
    setForm(prev => ({...prev, oldPass: "", newPass: "", confirmPass: ""}));
    alert("Profil berhasil diperbarui!");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm((p) => ({ ...p, photo: reader.result as string }));
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

      <div className="profile-wrapper">
        {/* SINGLE CARD CONTAINER */}
        <div className="profile-card">
          
          {/* LEFT COLUMN: SIDEBAR */}
          <div className="profile-sidebar-panel">
            <div className="profile-identity">
              <div
                className="photo-container"
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                <img
                  src={
                    form.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=8b1c15&color=fff`
                  }
                  className="avatar-img"
                  alt="avatar"
                />
                {isEditing && <div className="photo-edit-overlay">📷 Ubah</div>}
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handleFile} />
              
              <h2 className="user-name">{user.name}</h2>
              <p className="user-role">Donatur Heartify</p>
            </div>

            <nav className="profile-nav">
              <button
                className={`nav-btn ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                <span className="icon">👤</span> Informasi Pribadi
              </button>
              <button
                className={`nav-btn ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <span className="icon">🔔</span> Notifikasi
                {notifications.length > 0 && (
                  <span className="badge" style={{background:'#d35400', color:'white', padding:'2px 6px', borderRadius:'10px', fontSize:'0.7rem', marginLeft:'auto'}}>
                    {notifications.length}
                  </span>
                )}
              </button>
            </nav>

            <div className="sidebar-footer">
              <button className="btn-logout-link" onClick={handleLogout}>
                Keluar Akun
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTENT */}
          <div className="profile-content-panel">
            
            {/* TAB: INFO PRIBADI */}
            {activeTab === "info" && (
              <div className="content-fade-in">
                <div className="content-header">
                  <h3>Informasi Pribadi</h3>
                  {!isEditing && (
                    <button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>
                      ✎ Edit Profil
                    </button>
                  )}
                </div>

                <form className="profile-form" onSubmit={handleSave}>
                  <div className="form-grid-layout">
                    <div className="form-group">
                      <label>Nama Lengkap</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.name}
                        disabled={!isEditing}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={form.email}
                        disabled={!isEditing}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Nomor Telepon</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="+62..."
                        value={form.phone}
                        disabled={!isEditing}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{marginTop:'20px'}}>
                    <label>Bio Singkat</label>
                    <textarea 
                      className="form-input" 
                      rows={2} 
                      placeholder="Tulis sedikit tentang diri Anda..."
                      value={form.bio}
                      disabled={!isEditing}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    ></textarea>
                  </div>

                  {isEditing && (
                    <div className="password-section" style={{marginTop:'30px'}}>
                      <h4>Ubah Password (Opsional)</h4>
                      <div className="form-grid-layout">
                        <div className="form-group">
                          <label>Password Lama</label>
                          <input
                            type="password"
                            className="form-input"
                            onChange={(e) => setForm({ ...form, oldPass: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Password Baru</label>
                          <input
                            type="password"
                            className="form-input"
                            onChange={(e) => setForm({ ...form, newPass: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="form-actions">
                      <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                        Batal
                      </button>
                      <button type="submit" className="btn-save">
                        Simpan Perubahan
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* TAB: NOTIFIKASI */}
            {activeTab === "notifications" && (
              <div className="content-fade-in">
                <div className="content-header">
                  <h3>Riwayat Notifikasi</h3>
                </div>
                
                {notifications.length === 0 ? (
                  <div style={{textAlign:'center', padding:'40px', color:'#999'}}>
                    <p>Belum ada notifikasi terbaru.</p>
                  </div>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`notif-item ${notif.type}`} style={{
                        padding:'15px', borderRadius:'12px',
                        background: notif.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        borderLeft: `4px solid ${notif.type === 'success' ? '#10b981' : '#ef4444'}`
                      }}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                          <strong style={{color:'#2d3748'}}>{notif.title}</strong>
                          <small style={{color:'#718096'}}>{notif.date}</small>
                        </div>
                        <p style={{margin:0, fontSize:'0.9rem', color:'#4a5568'}}>{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}