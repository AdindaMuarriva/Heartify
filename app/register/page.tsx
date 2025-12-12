"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setPopupMessage("Harap isi semua kolom!");
      return;
    }

    const user = { name, email, password };
    localStorage.setItem("registeredUser", JSON.stringify(user));

    setPopupMessage("Registrasi Berhasil!");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="register-scope-wrapper">
      <div className="auth-card">
        <h2>Buat Akun</h2>
        <form onSubmit={handleRegister}>
          <input 
            type="text" placeholder="Nama Lengkap" 
            value={name} onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="email" placeholder="Alamat Email" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Kata Sandi" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" disabled={!name || !email || !password}>
            Daftar
          </button>
        </form>
        <p>
          Sudah punya akun? <Link href="/login">Masuk disini</Link>
        </p>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>{popupMessage}</p>
            <button className="popup-ok-btn" onClick={() => setPopupMessage(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}