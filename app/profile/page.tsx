// app/Profile/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./profile.css";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  bio: string | null;
  photo: string | null;
}

export default function Profile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("info");

  // State untuk menampung data statistik dari database
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignCount: 0,
    points: 0
  });

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
    const storedData = localStorage.getItem("user");
    if (!storedData) {
      router.push("/login");
      return;
    }
    
    const { _id, role } = JSON.parse(storedData);

    if (role === "admin") {
      router.push("/admin");
      return;
    }

    const fetchProfile = async () => {
        try {
            // 1. Ambil Data Dasar Profil
            const res = await fetch("/api/profile/me", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: _id }),
            });
            const result = await res.json();

            if (res.ok && result.success) {
                const fetchedUser: UserData = result.user;
                setUser(fetchedUser);
                setForm({
                    name: fetchedUser.name,
                    email: fetchedUser.email,
                    phone: fetchedUser.phone || "",
                    bio: fetchedUser.bio || "",
                    photo: fetchedUser.photo || "",
                    oldPass: "", newPass: "", confirmPass: ""
                });

                // 2. Ambil Statistik Donasi yang sudah VERIFIED
                const statsRes = await fetch("/api/profile/stats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: _id }),
                });
                const statsData = await statsRes.json();
                
                if (statsData.success) {
                    setStats({
                        totalDonated: statsData.totalDonated,
                        campaignCount: statsData.campaignCount,
                        points: statsData.points
                    });
                }
            }

            const allNotifs = JSON.parse(localStorage.getItem("userNotifications") || "[]");
            setNotifications(allNotifs.filter((n: any) => n.email === result.user?.email));

        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchProfile();
  }, [router]);

  // Handler Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading || !user) return <div className="loading-screen">Memuat Profil...</div>;
  
  const avatarUrl = form.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b1c15&color=fff`;

  return (
    <div className="profile-page">
      <div className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">Heartify</Link>
          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/about">Tentang Kami</Link>
            <Link href="/ajukankampanye">Ajukan Kampanye</Link>
            <Link href="/Profile" className="active">Profile</Link>
          </div>
          <button onClick={handleLogout} className="navbar-login-button">Keluar</button>
        </div>
      </div>

      <div className="profile-wrapper">
        <div className="profile-card">
          {/* Sidebar */}
          <div className="profile-sidebar-panel">
            <div className="profile-identity">
              <div className="photo-container">
                <img src={avatarUrl} className="avatar-img" alt="avatar"/>
              </div>
              <h2 className="user-name">{user.name}</h2>
              <p className="user-role">Donatur Heartify</p>
            </div>

            <nav className="profile-nav">
              <button className={`nav-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
                <span className="icon">👤</span> Dashboard
              </button>
              <button className={`nav-btn ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
                <span className="icon">🔔</span> Notifikasi
              </button>
            </nav>
            <div className="sidebar-footer">
              <button className="btn-logout-link" onClick={handleLogout}>Keluar Akun</button>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="profile-content-panel"> 
            {activeTab === "info" && (
                <div className="stats-row">
                    <div className="stat-card">
                      <div className="stat-icon gold">🤲</div>
                      <div className="stat-info">
                        <span>KAMPANYE DIDUKUNG</span>
                        <strong>{stats.campaignCount} Program</strong>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon blue">✨</div>
                      <div className="stat-info">
                        <span>POIN KEBAIKAN</span>
                        <strong>{stats.points} Poin</strong>
                      </div>
                    </div>
                     <div className="stat-card">
                      <div className="stat-icon red">💸</div>
                      <div className="stat-info">
                        <span>JUMLAH DONASI</span>
                        <strong>
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0
                            }).format(stats.totalDonated)}
                        </strong>
                      </div>
                    </div>
                </div>
            )}

            {/* Form Informasi Pribadi */}
            {activeTab === "info" && (
              <div className="content-fade-in">
                <div className="content-header">
                  <h3>Informasi Pribadi</h3>
                </div>
                <div className="profile-form">
                  <div className="form-grid-layout">
                    <div className="form-group">
                      <label>Nama Lengkap</label>
                      <input type="text" className="form-input" value={user.name} disabled />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" className="form-input" value={user.email} disabled />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}