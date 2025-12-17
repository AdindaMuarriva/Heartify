// app/login/page.tsx
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
      
      // Fallback to local auth was removed for security; show error only
    } finally {
      setLoading(false);
    }
  };

  // Removed insecure localStorage fallback authentication

  return (
    <div className="login-scope-wrapper">
      <div className="auth-card">
        <h2>Masuk ke Heartify</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p>
          Belum punya akun? <Link href="/register">Register</Link>
        </p>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupMessage(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}