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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const storedUser = localStorage.getItem("registeredUser");

    if (!storedUser) {
      setPopupMessage("Akun belum terdaftar");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.email === email && user.password === password) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      setPopupMessage("Login berhasil");

      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin_dashboard");
        } else {
          router.push("/beranda");
        }
      }, 1500);
    } else {
      setPopupMessage("Email atau password salah");
    }
  };

  return (
    <div className="login-scope-wrapper">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">Login</button>
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
