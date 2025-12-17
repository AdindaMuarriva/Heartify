// app/login/page.tsx - MODIFIED
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Simpan user data (tanpa password)
        localStorage.setItem("user", JSON.stringify(data.user));

        setPopupMessage("Login berhasil");

        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/beranda");
          }
        }, 1500);
      } else {
        setPopupMessage(data.message || "Email atau password salah");
      }
    } catch (error) {
      console.error("Login error:", error);
      setPopupMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-scope-wrapper">
    <div className="login-container">
      {/* HEADER/LOGO SECTION */}
      <div className="login-header">
        <div className="login-logo">Heartify</div>
        <p className="login-subtitle">Where Kindness Meets Action</p>
      </div>

      {/* LOGIN CARD */}
      <div className="auth-card">
        <h2>Masuk ke Akun Anda</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Alamat Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="register-link">
          Belum punya akun? <Link href="/register">Daftar Sekarang</Link>
        </p>
      </div>

      {/* FOOTER INFO */}
      <div className="login-footer">
        © 2025 Heartify. Seluruh hak cipta dilindungi.
      </div>

      {/* POPUP */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupMessage(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}