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
      setPopupMessage("Harap isi semua field!");
      return;
    }
    const user = { name, email, password };
    localStorage.setItem("registeredUser", JSON.stringify(user));
    setPopupMessage("Register berhasil!");
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="register-scope-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={!name || !email || !password}>Register</button>
        </form>
        <p>Already have an account? <Link href="/login">Login</Link></p>
      </div>
      {popupMessage && <div className="popup-overlay"><div className="popup-card"><p>{popupMessage}</p></div></div>}
    </div>
  );
}