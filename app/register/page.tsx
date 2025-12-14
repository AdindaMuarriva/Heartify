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

  const [role, setRole] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");

  const [popup, setPopup] = useState<string | null>(null);

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setPopup("Semua kolom wajib diisi");
      return;
    }

    if (role === "admin" && adminCode !== "ADMIN123") {
      setPopup("Kode admin salah");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role,
    };

    localStorage.setItem("registeredUser", JSON.stringify(newUser));
    setPopup("Registrasi berhasil");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="login-scope-wrapper">
      <div className="auth-card">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

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

          {/* PILIH ROLE */}
          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "user" | "admin")
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* KODE ADMIN */}
          {role === "admin" && (
            <input
              type="password"
              placeholder="Kode Admin"
              value={adminCode}
              onChange={(event) => setAdminCode(event.target.value)}
            />
          )}

          <button type="submit">Daftar</button>
        </form>

        <p>
          Sudah punya akun? <Link href="/login">Login</Link>
        </p>
      </div>

      {popup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>{popup}</p>
          </div>
        </div>
      )}
    </div>
  );
}
