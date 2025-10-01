import { useState, type FormEvent } from "react"; 
import { Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registeredUser = localStorage.getItem("registeredUser");

    if (!registeredUser) {
      setShowPopup(true); // tampilkan popup kalau belum register
      return;
    }

    const user = JSON.parse(registeredUser);
    if (user.email === email && user.password === password) {
      alert("Login berhasil!");
      window.location.href = "/";
    } else {
      alert("Email atau Password salah!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
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
            <button type="submit">Login</button>
          </form>
          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {/* 🔹 Popup muncul kalau belum register */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Anda belum Register</h3>
            <p>Silakan daftar terlebih dahulu sebelum login.</p>
            <button onClick={() => (window.location.href = "/register")}>
              Register Sekarang
            </button>
            <button onClick={() => setShowPopup(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}