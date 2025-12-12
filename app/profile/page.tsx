"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./profile.css";

interface User { name: string; email: string; password: string; photo?: string; }

export default function Profile() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", photo: "", oldPass: "", newPass: "", confirmPass: "" });
  const [popup, setPopup] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("registeredUser");
    if (!data) { router.push("/login"); return; }
    const parsed = JSON.parse(data);
    setUser(parsed);
    setEditData(prev => ({ ...prev, name: parsed.name, email: parsed.email, photo: parsed.photo || "" }));
  }, [router]);

  const handleLogout = () => { localStorage.removeItem("registeredUser"); router.push("/login"); };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); if(!user) return;
    let finalPass = user.password;
    if(editData.newPass){
        if(editData.oldPass !== user.password){ setPopup("Password salah!"); return;}
        if(editData.newPass !== editData.confirmPass){ setPopup("Password tidak cocok!"); return;}
        finalPass = editData.newPass;
    }
    const newUser = { name: editData.name, email: editData.email, password: finalPass, photo: editData.photo };
    localStorage.setItem("registeredUser", JSON.stringify(newUser));
    setUser(newUser); setIsEditing(false); setPopup("Profil tersimpan!"); setTimeout(()=>setPopup(null), 1500);
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.[0]){
        const r = new FileReader();
        r.onloadend=()=>setEditData(p=>({...p, photo: r.result as string}));
        r.readAsDataURL(e.target.files[0]);
    }
  };

  if (!user) return <div className="profile-wrapper">Loading...</div>;

  return (
    <div className="profile-wrapper">
      <div className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/about">Tentang Kami</Link>
            <Link href="/profile">Profile</Link>
          </div>
          <button onClick={handleLogout} className="navbar-login-button">Keluar</button>
        </div>
      </div>

      <div className="profile-container">
        <h1>Profil Saya</h1>
        <div className="profile-grid">
          <div className="profile-left">
            <div className="photo-box" onClick={() => isEditing && fileRef.current?.click()}>
                <img src={editData.photo || `https://ui-avatars.com/api/?name=${user.name}&background=8b1c15&color=fff`} className="profile-img" alt="Foto"/>
                {isEditing && <div className="overlay">Ubah</div>}
            </div>
            <input type="file" ref={fileRef} hidden onChange={handleFile} />
            <h2>{user.name}</h2>
            <div className="badge">Aktif</div>
          </div>
          <div className="profile-right">
            <div className="head-row">
                <h3>Detail Info</h3>
                {!isEditing && <button className="btn-edit" onClick={()=>setIsEditing(true)}>Edit</button>}
            </div>
            {!isEditing ? (
                <div className="info">
                    <p><strong>Nama:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            ) : (
                <form onSubmit={handleSave} className="form">
                    <label>Nama</label><input value={editData.name} onChange={e=>setEditData({...editData, name:e.target.value})}/>
                    <label>Email</label><input value={editData.email} onChange={e=>setEditData({...editData, email:e.target.value})}/>
                    <h4>Ganti Password</h4>
                    <input type="password" placeholder="Lama" onChange={e=>setEditData({...editData, oldPass:e.target.value})}/>
                    <div className="row">
                        <input type="password" placeholder="Baru" onChange={e=>setEditData({...editData, newPass:e.target.value})}/>
                        <input type="password" placeholder="Konfirmasi" onChange={e=>setEditData({...editData, confirmPass:e.target.value})}/>
                    </div>
                    <div className="btns"><button className="save">Simpan</button><button type="button" onClick={()=>setIsEditing(false)}>Batal</button></div>
                </form>
            )}
          </div>
        </div>
      </div>
      {popup && <div className="popup"><div className="card">{popup}<button onClick={()=>setPopup(null)}>OK</button></div></div>}
    </div>
  );
}