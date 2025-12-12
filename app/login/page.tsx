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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Cek hanya di browser
    if (typeof window !== "undefined") {
      const registeredUser = localStorage.getItem("registeredUser");

      if (!registeredUser) {
        setPopupMessage("Anda belum register. Silakan daftar terlebih dahulu.");
        return;
      }

      const user = JSON.parse(registeredUser);

      if (user.email === email && user.password === password) {
        setPopupMessage("Login berhasil");
        setTimeout(() => {
          router.push("/beranda"); // Arahkan ke dashboard
        }, 1500);
      } else {
        setPopupMessage("Email atau Password salah!");
      }
    }
  };

  return (
    /* Wrapper Class Unik */
    <div className="login-scope-wrapper"> 
      <div className="auth-card">
        <h2>Heartify Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={!email || !password}>
            Login
          </button>
        </form>
        <p>
          Don’t have an account? <Link href="/register">Register</Link>
        </p>
      </div>

      {/* Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>{popupMessage}</p>
            <button className="popup-ok-btn" onClick={() => setPopupMessage(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}