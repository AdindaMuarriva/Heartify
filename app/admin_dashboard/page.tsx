"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "/admin.css";

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Dashboard Admin</h1>

      <div className="dashboard-card">
        <h2>Kelola Platform Heartify</h2>

        <ul>
          <li>Kelola data pengguna</li>
          <li>Kelola kampanye donasi</li>
          <li>Verifikasi pengajuan kampanye</li>
          <li>Lihat laporan donasi</li>
        </ul>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
