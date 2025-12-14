"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";

type Campaign = {
  id: string;
  title: string;
  target: number;
  collected: number;
  distributed: number;
  description: string;
  status: string;
};

type Donation = {
  id: string;
  donorName: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  status: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [adminName, setAdminName] = useState("");

  const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [donationHistory, setDonationHistory] = useState<Donation[]>([]);

  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [distributeAmount, setDistributeAmount] = useState<number | string>("");
  const [distributeNote, setDistributeNote] = useState("");

  /* ===============================
     AUTH CHECK
  ================================ */
  useEffect(() => {
    const userStr = localStorage.getItem("registeredUser");

    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      router.push("/beranda");
      return;
    }

    setAdminName(user.name);
    loadData();
  }, []);

  /* ===============================
     LOAD DATA
  ================================ */
  const loadData = () => {
    const pending = JSON.parse(localStorage.getItem("pendingCampaigns") || "[]");
    const active = JSON.parse(localStorage.getItem("campaignsData") || "[]");
    const donations = JSON.parse(localStorage.getItem("donationHistory") || "[]");

    setPendingCampaigns(pending);
    setDonationHistory(donations);

    setActiveCampaigns(
      active.map((c: Campaign) => ({
        ...c,
        collected: c.collected || 0,
        distributed: c.distributed || 0,
      }))
    );
  };

  /* ===============================
     CAMPAIGN ACTIONS
  ================================ */
  const approveCampaign = (campaign: Campaign) => {
    const updatedActive = [
      ...activeCampaigns,
      {
        ...campaign,
        id: Date.now().toString(),
        status: "active",
        collected: 0,
        distributed: 0,
      },
    ];

    localStorage.setItem("campaignsData", JSON.stringify(updatedActive));
    localStorage.setItem(
      "pendingCampaigns",
      JSON.stringify(pendingCampaigns.filter((c) => c.id !== campaign.id))
    );

    alert("Kampanye disetujui");
    loadData();
  };

  const rejectCampaign = (id: string) => {
    if (!confirm("Yakin ingin menolak kampanye ini?")) return;

    localStorage.setItem(
      "pendingCampaigns",
      JSON.stringify(pendingCampaigns.filter((c) => c.id !== id))
    );

    loadData();
  };

  /* ===============================
     DONATION VERIFICATION
  ================================ */
  const verifyDonation = (donation: Donation) => {
    const updatedDonations = donationHistory.map((d) =>
      d.id === donation.id ? { ...d, status: "success" } : d
    );

    const updatedCampaigns = activeCampaigns.map((c) =>
      c.id === donation.campaignId
        ? { ...c, collected: c.collected + donation.amount }
        : c
    );

    localStorage.setItem("donationHistory", JSON.stringify(updatedDonations));
    localStorage.setItem("campaignsData", JSON.stringify(updatedCampaigns));

    alert("Donasi berhasil diverifikasi");
    loadData();
  };

  /* ===============================
     DISTRIBUTION
  ================================ */
  const openDistribute = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDistributeAmount("");
    setDistributeNote("");
    setShowDistributeModal(true);
  };

  const submitDistribution = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCampaign) return;

    const amount = Number(distributeAmount);
    const available =
      selectedCampaign.collected - selectedCampaign.distributed;

    if (amount <= 0 || amount > available) {
      alert("Jumlah penyaluran tidak valid");
      return;
    }

    const updatedCampaigns = activeCampaigns.map((c) =>
      c.id === selectedCampaign.id
        ? { ...c, distributed: c.distributed + amount }
        : c
    );

    localStorage.setItem("campaignsData", JSON.stringify(updatedCampaigns));
    alert("Dana berhasil disalurkan");

    setShowDistributeModal(false);
    loadData();
  };

  /* ===============================
     LOGOUT
  ================================ */
  const logout = () => {
    localStorage.removeItem("registeredUser");
    router.push("/login");
  };

  const totalCollected = activeCampaigns.reduce(
    (sum, c) => sum + c.collected,
    0
  );

  const totalDistributed = activeCampaigns.reduce(
    (sum, c) => sum + c.distributed,
    0
  );

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="admin-dashboard-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h2>Heartify</h2>

        <div className="admin-profile-mini">
          <div className="avatar-circle">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{adminName}</strong>
            <small>Administrator</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab("overview")}>
            Overview
          </button>
          <button onClick={() => setActiveTab("campaigns")}>
            Kampanye
          </button>
          <button onClick={() => setActiveTab("donations")}>
            Donasi
          </button>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        {activeTab === "overview" && (
          <>
            <h1>Dashboard Admin</h1>

            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Total Dana Terkumpul</h3>
                <p>Rp {totalCollected.toLocaleString("id-ID")}</p>
              </div>
              <div className="stat-card">
                <h3>Total Dana Tersalurkan</h3>
                <p>Rp {totalDistributed.toLocaleString("id-ID")}</p>
              </div>
              <div className="stat-card">
                <h3>Kampanye Aktif</h3>
                <p>{activeCampaigns.length}</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "campaigns" && (
          <>
            <h2>Pengajuan Kampanye</h2>
            {pendingCampaigns.map((c) => (
              <div key={c.id} className="card">
                <h4>{c.title}</h4>
                <p>{c.description}</p>
                <button onClick={() => approveCampaign(c)}>Setujui</button>
                <button onClick={() => rejectCampaign(c.id)}>Tolak</button>
              </div>
            ))}
          </>
        )}

        {activeTab === "donations" && (
          <>
            <h2>Verifikasi Donasi</h2>
            {donationHistory
              .filter((d) => d.status === "pending")
              .map((d) => (
                <div key={d.id} className="card">
                  <p>{d.donorName}</p>
                  <p>{d.campaignTitle}</p>
                  <p>Rp {d.amount.toLocaleString("id-ID")}</p>
                  <button onClick={() => verifyDonation(d)}>
                    Verifikasi
                  </button>
                </div>
              ))}
          </>
        )}
      </main>

      {/* MODAL DISTRIBUTION */}
      {showDistributeModal && selectedCampaign && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={submitDistribution}>
            <h3>Penyaluran Dana</h3>
            <input
              type="number"
              placeholder="Jumlah Dana"
              value={distributeAmount}
              onChange={(e) => setDistributeAmount(e.target.value)}
            />
            <textarea
              placeholder="Catatan"
              value={distributeNote}
              onChange={(e) => setDistributeNote(e.target.value)}
            />
            <button type="submit">Salurkan</button>
            <button type="button" onClick={() => setShowDistributeModal(false)}>
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
