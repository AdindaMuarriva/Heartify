"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./ajukan.css";

export default function AjukanKampanye() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Kesehatan",
    target: "",
    deadline: "",
    image: "",
    description: "",
    beneficiary: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("registeredUser");

    if (!data) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(data);

    // Proteksi admin
    if (parsedUser.role === "admin") {
      router.push("/admin");
      return;
    }

    setUser(parsedUser);
    setUserRole(parsedUser.role || "user");
  }, [router]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const pending = JSON.parse(
        localStorage.getItem("pendingCampaigns") || "[]"
      );

      const newCampaign = {
        id: 'campaign-${Date.now()}',
        ...form,
        target: Number(form.target),
        collected: 0,
        admin: user.name,
        email: user.email,
        status: "pending",
        submittedDate: new Date().toLocaleDateString("id-ID"),
      };

      pending.push(newCampaign);
      localStorage.setItem("pendingCampaigns", JSON.stringify(pending));

      setIsSubmitting(false);
      setPopup("Kampanye berhasil diajukan! Menunggu verifikasi Admin.");

      setTimeout(() => router.push("/beranda"), 2000);
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="ajukan-body">
      {/* NAVBAR */}
      <nav className="navbar-container">
        <div className="navbar">
          <Link href="/beranda" className="navbar-logo">
            Heartify
          </Link>

          <div className="navbar-links">
            <Link href="/beranda">Beranda</Link>
            <Link href="/about">Tentang Kami</Link>
            <Link
              href="/ajukan-kampanye"
              className="active-link"
              style={{
                borderBottom: "2px solid #8b1c15",
                color: "#8b1c15",
              }}
            >
              Ajukan Kampanye
            </Link>
            <Link href="/Profile">Profile</Link>
          </div>

          <button
            onClick={handleLogout}
            className="navbar-login-button"
          >
            Keluar
          </button>
        </div>
      </nav>

      {/* FORM */}
      <div className="ajukan-wrapper">
        <div className="form-card">
          <div className="form-header">
            <h1>Mulai Kebaikan Baru</h1>
            <p>
              Isi detail kampanye Anda dengan jelas agar donatur
              percaya.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul Kampanye</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Pembangunan Sekolah..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kategori</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Kesehatan</option>
                  <option>Pendidikan</option>
                  <option>Kemanusiaan</option>
                  <option>Bencana Alam</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Donasi (Rp)</label>
                <input
                  type="number"
                  name="target"
                  required
                  value={form.target}
                  onChange={handleChange}
                  placeholder="50000000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Penerima Manfaat</label>
                <input
                  type="text"
                  name="beneficiary"
                  required
                  value={form.beneficiary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Batas Waktu</label>
                <input
                  type="date"
                  name="deadline"
                  required
                  value={form.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Link Foto (URL)</label>
              <input
                type="url"
                name="image"
                required
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />

              {form.image && (
                <div className="image-preview">
                  <img
                    src={form.image}
                    alt="Preview"
                    onError={(e: any) =>
                      (e.target.style.display = "none")
                    }
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Cerita Lengkap</label>
              <textarea
                name="description"
                required
                rows={6}
                value={form.description}
                onChange={handleChange}
                placeholder="Ceritakan detailnya..."
              />
            </div>

            <div className="form-actions">
              <Link href="/beranda" className="btn-cancel">
                Batal
              </Link>

              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Ajukan Kampanye"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {popup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Berhasil!</h3>
            <p>{popup}</p>
          </div>
        </div>
      )}
    </div>
  );
}
