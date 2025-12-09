"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import "./profile.css";

interface User {
  name: string;
  email: string;
  password: string;
}

export default function Profile() {
  const router = useRouter(); // Inisialisasi router Next.js
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    // Cek localStorage hanya saat komponen sudah dimuat di client
    const registeredUser = localStorage.getItem("registeredUser");
    if (!registeredUser) {
      router.push("/login"); // Redirect jika tidak ada user
      return;
    }
    
    const userData = JSON.parse(registeredUser);
    setUser(userData);
    setEditData(prev => ({
      ...prev,
      name: userData.name,
      email: userData.email
    }));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    setPopupMessage("Logout berhasil!");
    setTimeout(() => {
      router.push("/login"); // Redirect menggunakan router.push
    }, 1500);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validasi untuk perubahan password
    if (editData.newPassword || editData.confirmPassword || editData.currentPassword) {
      if (!editData.currentPassword) {
        setPopupMessage("Harap masukkan password saat ini untuk mengubah password!");
        return;
      }

      if (editData.currentPassword !== user.password) {
        setPopupMessage("Password saat ini salah!");
        return;
      }

      if (editData.newPassword.length < 6) {
        setPopupMessage("Password baru harus minimal 6 karakter!");
        return;
      }

      if (editData.newPassword !== editData.confirmPassword) {
        setPopupMessage("Password baru dan konfirmasi password tidak cocok!");
        return;
      }
    }

    // Update user data
    const updatedUser = {
      name: editData.name,
      email: editData.email,
      password: editData.newPassword || user.password
    };

    // Simpan ke localStorage
    localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    
    setPopupMessage("Profil berhasil diperbarui!");
    setTimeout(() => setPopupMessage(null), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Navbar */}
      <header className="profile-navbar">
        <div className="navbar-container">
          {/* Ubah 'to' menjadi 'href' */}
          <Link href="/beranda" className="navbar-logo">
            Heartify
          </Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/AboutPage">Tentang Kami</Link>
            <Link href="/profile" className="active">Profil</Link>
          </div>
          <button onClick={handleLogout} className="navbar-logout-btn">
            Keluar
          </button>
        </div>
      </header>

      <div className="profile-container">
        <div className="profile-header">
          <h1>Profil Saya</h1>
          <p>Kelola informasi profil Anda untuk mengontrol dan mengamankan akun</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2>Informasi Pribadi</h2>
              {!isEditing && (
                <button onClick={handleEdit} className="edit-btn">
                  Edit Profil
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-info">
                <div className="info-item">
                  <label>Nama Lengkap</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <p className="status-active">Aktif</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="edit-form">
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="password-section">
                  <h3>Ubah Password</h3>
                  
                  <div className="form-group">
                    <label htmlFor="currentPassword">Password Saat Ini</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={editData.currentPassword}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Masukkan password saat ini"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">Password Baru</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={editData.newPassword}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={editData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ulangi password baru"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Simpan Perubahan
                  </button>
                  <button type="button" onClick={handleCancel} className="cancel-btn">
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="stats-card">
            <h2>Statistik Donasi</h2>
            <div className="stats-grid"> 
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>Member Sejak</h3>
                  <p>{new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>{popupMessage}</p>
            <button 
              className="popup-ok-btn" 
              onClick={() => setPopupMessage(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}