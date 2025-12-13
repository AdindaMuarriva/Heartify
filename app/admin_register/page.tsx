"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "/admin.css";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name === "" || email === "" || password === "") {
      alert("Semua field wajib diisi");
      return;
    }

    alert("Registrasi admin berhasil");
    router.push("/admin/login");
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Register Admin</h1>

      <form className="admin-form" onSubmit={handleRegister}>
        <label>Nama Lengkap</label>
        <input
          type="text"
          placeholder="Nama admin"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="admin@heartify.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password admin"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Daftar</button>
      </form>
    </div>
  );
}
