"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./buat-laporan.css";

export default function BuatLaporan() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kemanusiaan",
    location: "",
    target: 0,
    completionDate: "",
    beneficiary: "",
    duration: "",
    description: "",
    details: [""],
    impact: [""],
    admin: "",
    contactPerson: "",
    image: ""
  });

  // Validasi Admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      router.push("/login");
      return;
    }
    setFormData(prev => ({ ...prev, admin: user.name }));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validasi sederhana
    if (!formData.title.trim() || !formData.description.trim()) {
      setMessage({type: 'error', text: 'Judul dan deskripsi harus diisi'});
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          details: formData.details.filter(item => item.trim() !== ""),
          impact: formData.impact.filter(item => item.trim() !== "")
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({type: 'success', text: '✅ Laporan berhasil diterbitkan!'});
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        setMessage({type: 'error', text: data.message || '❌ Gagal menyimpan laporan'});
      }
    } catch (error) {
      setMessage({type: 'error', text: '❌ Terjadi kesalahan jaringan'});
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menambah field list
  const addField = (field: 'details' | 'impact') => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const updateField = (field: 'details' | 'impact', index: number, value: string) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData({ ...formData, [field]: newList });
  };

  const removeField = (field: 'details' | 'impact', index: number) => {
    const newList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newList });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="buatlaporan-page">
      <div className="buatlaporan-container">
        <div className="form-panel">
          <div className="form-header">
            <h2>
              <span className="form-header-icon">📊</span>
              Buat Laporan Penyaluran Baru
            </h2>
          </div>

          <div className="form-body">
            {message && (
              <div className={`form-message ${message.type}`}>
                <span>{message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}</span>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Judul Program <span>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Bantuan Pangan untuk Korban Banjir"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Kategori <span>*</span></label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Kemanusiaan">Kemanusiaan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Bencana Alam">Bencana Alam</option>
                    <option value="Lingkungan">Lingkungan</option>
                    <option value="Anak">Anak</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>URL Gambar Banner</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                />
                {formData.image && (
                  <div className="image-preview">
                    <div className="preview-container">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="preview-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {!formData.image.startsWith('http') && (
                        <div className="preview-placeholder">
                          <div className="preview-placeholder-icon">🖼️</div>
                          <p>Masukkan URL gambar yang valid</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Lokasi <span>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Jakarta Timur"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Total Dana Disalurkan <span>*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="10000000"
                    min="0"
                    value={formData.target}
                    onChange={e => setFormData({...formData, target: Number(e.target.value)})}
                  />
                  <div className="char-count">
                    {formatCurrency(formData.target)}
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Tanggal Selesai <span>*</span></label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.completionDate}
                    onChange={e => setFormData({...formData, completionDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Penerima Manfaat <span>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: 500+ orang, 100 keluarga"
                    value={formData.beneficiary}
                    onChange={e => setFormData({...formData, beneficiary: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Durasi Program</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: 3 bulan, 30 hari"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Deskripsi Ringkas <span>*</span></label>
                <textarea
                  className="form-textarea"
                  placeholder="Jelaskan secara singkat tentang program penyaluran ini..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  maxLength={1000}
                />
                <div className={`char-count ${formData.description.length > 900 ? 'warning' : ''} ${formData.description.length >= 1000 ? 'error' : ''}`}>
                  {formData.description.length}/1000 karakter
                </div>
              </div>

              <div className="list-section">
                <h3>Detail Penyaluran Dana</h3>
                <div className="list-items">
                  {formData.details.map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="list-number">{index + 1}</span>
                      <input
                        type="text"
                        className="list-input"
                        placeholder="Contoh: Paket sembako untuk 200 keluarga"
                        value={item}
                        onChange={e => updateField('details', index, e.target.value)}
                      />
                      {formData.details.length > 1 && (
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeField('details', index)}
                          title="Hapus item"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="add-button"
                  onClick={() => addField('details')}
                >
                  <span className="add-icon">+</span>
                  Tambah Detail Penyaluran
                </button>
              </div>

              <div className="list-section">
                <h3>Dampak yang Dicapai</h3>
                <div className="list-items">
                  {formData.impact.map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="list-number">{index + 1}</span>
                      <input
                        type="text"
                        className="list-input"
                        placeholder="Contoh: 15 keluarga mendapatkan tempat tinggal tetap"
                        value={item}
                        onChange={e => updateField('impact', index, e.target.value)}
                      />
                      {formData.impact.length > 1 && (
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeField('impact', index)}
                          title="Hapus item"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="add-button"
                  onClick={() => addField('impact')}
                >
                  <span className="add-icon">+</span>
                  Tambah Dampak
                </button>
              </div>

              <div className="form-group">
                <label>Kontak Person (Opsional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nama dan nomor telepon"
                  value={formData.contactPerson}
                  onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <span className="submit-icon">📤</span>
                      Terbitkan Laporan
                    </>
                  )}
                </button>
                <Link href="/admin/dashboard" className="cancel-button">
                  Batalkan
                </Link>
              </div>
            </form>

            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Menyimpan laporan...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}