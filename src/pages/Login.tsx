import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registeredUser = localStorage.getItem("registeredUser");

    // 🔹 Belum register
    if (!registeredUser) {
      setPopupMessage("Anda belum register. Silakan daftar terlebih dahulu.");
      return;
    }

    const user = JSON.parse(registeredUser);

    // 🔹 Cek login
    if (user.email === email && user.password === password) {
      setPopupMessage("Login berhasil");
      setTimeout(() => {
        navigate("/beranda"); // pindah ke beranda
      }, 1500);
    } else {
      setPopupMessage("Email atau Password salah!");
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
            <button type="submit" disabled={!email || !password}>
              Login
            </button>
          </form>
          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {/* 🔹 Popup di sini */}
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