"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "/admin.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === "" || password === "") {
      setErrorMessage("Email dan password wajib diisi");
      return;
    }

    // Simulasi login admin
    if (email === "admin@heartify.com" && password === "admin123") {
      router.push("/admin/dashboard");
    } else {
      setErrorMessage("Email atau password salah");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Login Admin</h1>

      <form className="admin-form" onSubmit={handleLogin}>
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
          placeholder="Masukkan password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button type="submit">Masuk</button>
      </form>
    </div>
  );
}
