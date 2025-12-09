"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./profile.css"; // CSS khusus Profile

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data hanya saat di client
    const registeredUser = localStorage.getItem("registeredUser");
    if (!registeredUser) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(registeredUser);
    setUser(parsed);
    setEditData({ name: parsed.name, email: parsed.email });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    setPopupMessage("Berhasil Keluar");
    setTimeout(() => router.push("/login"), 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Simpan data baru
    const updated = { ...user, name: editData.name, email: editData.email };
    localStorage.setItem("registeredUser", JSON.stringify(updated));
    setUser(updated);
    setIsEditing(false);
    setPopupMessage("Profil Diperbarui!");
    setTimeout(() => setPopupMessage(null), 1500);
  };

  if (!user) return <div className="profile-scope-wrapper">Loading...</div>;

  return (
    <div className="profile-scope-wrapper">
      <header className="navbar-container">
        <nav className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/aboutpage">Tentang Kami</Link>
            <Link href="/profile" className="active">Profil</Link>
          </div>
          <button onClick={handleLogout} className="navbar-logout-btn">Keluar</button>
        </nav>
      </header>

      <div className="profile-container">
        <h1 className="header-title">Profil Saya</h1>
        <div className="profile-card">
          <div className="card-top">
            <h2>Info Pribadi</h2>
            {!isEditing && <button onClick={() => setIsEditing(true)} className="btn-edit">Edit</button>}
          </div>

          {!isEditing ? (
            <div className="info-display">
              <div className="row"><label>Nama</label> <span>{user.name}</span></div>
              <div className="row"><label>Email</label> <span>{user.email}</span></div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="form-edit">
              <label>Nama Lengkap</label>
              <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
              <label>Email</label>
              <input value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} />
              <div className="form-actions">
                <button type="submit" className="btn-save">Simpan</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Batal</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {popupMessage && <div className="popup-overlay"><div className="popup-card"><p>{popupMessage}</p></div></div>}
    </div>
  );
}