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
  const [popup, setPopup] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    photo: "",
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("registeredUser");
    if (!data) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(data);
    setUser(parsed);
    setForm((p) => ({ ...p, name: parsed.name, email: parsed.email, photo: parsed.photo || "" }));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let finalPass = user.password;

    // Validasi sederhana
    if (form.newPass && (form.newPass !== form.confirmPass || form.oldPass !== user.password)) {
      setPopup("Cek kembali password!");
      setTimeout(() => setPopup(null), 2000);
      return;
    }

    if (form.newPass) finalPass = form.newPass;

    const newUser = {
      ...user,
      name: form.name,
      email: form.email,
      password: finalPass,
      photo: form.photo,
    };

    localStorage.setItem("registeredUser", JSON.stringify(newUser));
    setUser(newUser);
    setIsEditing(false);
    setPopup("Berhasil disimpan!");
    setTimeout(() => setPopup(null), 2000);
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
      {/* Navbar Konsisten */}
      <div className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">
            Heartify
          </Link>

          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/aboutpage">Tentang Kami</Link>
            <Link href="/profile" className="active">
              Profile
            </Link>
          </div>

          <button onClick={handleLogout} className="navbar-login-button">
            Keluar
          </button>
        </div>
      </div>

      <div className="profile-container">
        <h1>Pengaturan Profil</h1>

        <div className="profile-dashboard">
          {/* SIDEBAR */}
          <aside className="profile-sidebar">
            <div className="photo-wrapper" onClick={() => isEditing && fileInputRef.current?.click()}>
              <img
                src={
                  form.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b1c15&color=fff`
                }
                className="avatar"
                alt="avatar"
              />
              {isEditing && <div className="photo-overlay">📸</div>}
            </div>

            <input type="file" ref={fileInputRef} hidden onChange={handleFile} />

            <div className="user-info">
              <h2>{user.name}</h2>
              <p>Donatur Aktif</p>
            </div>

            <button className="btn-logout-side" onClick={handleLogout}>
              Log Out
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <main className="profile-main">
            <div className="main-header">
              <h3>Informasi Pribadi</h3>
              {!isEditing && (
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  Edit Profil
                </button>
              )}
            </div>

            <form className="profile-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {isEditing && (
                <div className="password-zone">
                  <h4>Ubah Password (Opsional)</h4>
                  <input
                    type="password"
                    placeholder="Password Lama"
                    onChange={(e) => setForm({ ...form, oldPass: e.target.value })}
                  />
                  <div className="row">
                    <input
                      type="password"
                      placeholder="Password Baru"
                      onChange={(e) => setForm({ ...form, newPass: e.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="Konfirmasi"
                      onChange={(e) => setForm({ ...form, confirmPass: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setIsEditing(false);
                      setForm((prev) => ({ ...prev, name: user.name, photo: user.photo || "" }));
                    }}
                  >
                    Batal
                  </button>
                </div>
              )}
            </form>
          </main>
        </div>
      </div>

      {popup && <div className="toast">{popup}</div>}
    </div>
  );
}
