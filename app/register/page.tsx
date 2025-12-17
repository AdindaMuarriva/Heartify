// app/register/page.tsx - UPDATED
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

type Role = "user" | "admin";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [adminCode, setAdminCode] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorDetails(null);

    // Validasi client-side
    if (!name || !email || !password || !confirmPassword) {
      setPopupMessage("Semua kolom wajib diisi");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPopupMessage("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPopupMessage("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (role === "admin" && adminCode !== "ADMIN123") {
      setPopupMessage("Kode admin salah");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending register request...");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          adminCode: role === "admin" ? adminCode : undefined
        })
      });

      const data = await response.json();
      console.log("Register response:", data);

      if (data.success) {
        // Simpan user data untuk auto-login atau reference (tanpa password)
        const userData = {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        };

        localStorage.setItem("user", JSON.stringify(userData));
        
        setPopupMessage("🎉 Registrasi berhasil! Anda akan dialihkan ke login.");
        setErrorDetails(null);

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setPopupMessage(`❌ ${data.message}`);
        setErrorDetails(data.error || null);
      }
    } catch (error: any) {
      console.error("Register error:", error);
      setPopupMessage("⚠️ Terjadi kesalahan. Silakan coba lagi.");
      setErrorDetails(error.message);
      
      // Fallback registration via localStorage removed for security
    } finally {
      setLoading(false);
    }
  };

  // Removed insecure fallback registration that stored plain password in localStorage

  // Clear form
  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAdminCode("");
    setRole("user");
  };

  // Test dengan data dummy
  const fillTestData = (type: "user" | "admin") => {
    if (type === "user") {
      setName("User Test");
      setEmail("user.test@example.com");
      setPassword("password123");
      setConfirmPassword("password123");
      setRole("user");
    } else {
      setName("Admin Test");
      setEmail("admin.test@example.com");
      setPassword("admin123");
      setConfirmPassword("admin123");
      setRole("admin");
      setAdminCode("ADMIN123");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="auth-card">
        <h2>Register</h2>

        {/* Test buttons */}
        <div className="test-buttons" style={{ 
          display: "flex", 
          gap: "10px", 
          marginBottom: "15px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            type="button"
            onClick={() => fillTestData("user")}
            className="test-btn"
            style={{
              padding: "5px 10px",
              background: "#3e0703",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
              cursor: "pointer",
              flex: "1",
              minWidth: "100px"
            }}
          >
            Fill User Test
          </button>
          <button
            type="button"
            onClick={() => fillTestData("admin")}
            className="test-btn"
            style={{
              padding: "5px 10px",
              background: "#8b1c15",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
              cursor: "pointer",
              flex: "1",
              minWidth: "100px"
            }}
          >
            Fill Admin Test
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password (minimal 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />

          {/* ROLE SELECT */}
          <div className={`role-select ${role}`}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={loading}
            >
              <option value="user">👤 User</option>
              <option value="admin">👑 Admin</option>
            </select>

            <span className="role-badge">
              {role === "admin" ? "ADMIN" : "USER"}
            </span>
          </div>

          {/* ADMIN CODE */}
          {role === "admin" && (
            <input
              type="password"
              placeholder="Kode Admin (ADMIN123)"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              disabled={loading}
            />
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? "#ccc" : "#3e0703",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Mendaftarkan..." : "📝 Daftar"}
          </button>
        </form>
            <br></br>
        <p>
          Sudah punya akun?
          <Link href="/login"> Login</Link>
        </p>
        
        <div style={{ 
          fontSize: "12px", 
          color: "#666", 
          marginTop: "10px",
          textAlign: "center",
          padding: "10px",
          borderRadius: "8px"
        }}>
        </div>
      </div>

      {/* POPUP */}
      {popupMessage && (
        <div className="popup-box">
          <div className="card" style={{ maxWidth: "400px" }}>
            <p>{popupMessage}</p>
            {errorDetails && (
              <div style={{ 
                fontSize: "11px", 
                color: "#666", 
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                fontFamily: "monospace",
                textAlign: "left"
              }}>
                <strong>Error details:</strong><br/>
                {errorDetails}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button onClick={() => setPopupMessage(null)}>
                OK
              </button>
              {popupMessage.includes("berhasil") && (
                <button onClick={clearForm} style={{ background: "#6b7280" }}>
                  Clear Form
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}