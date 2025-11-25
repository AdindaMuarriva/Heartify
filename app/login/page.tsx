"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Heartify Login</h2>
        <form>
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}