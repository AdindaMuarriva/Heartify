import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./detailKampanye.css";

const DetailKampanye: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [donationAmount, setDonationAmount] = useState<number | "">("");
  const [quickAmount, setQuickAmount] = useState<number>(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>("");

  // Load data dari localStorage saat komponen mount
  useEffect(() => {
    const savedCampaigns = localStorage.getItem("campaignsData");
    if (savedCampaigns) {
      const parsedCampaigns = JSON.parse(savedCampaigns);
      setCampaigns(parsedCampaigns);
      const foundCampaign = parsedCampaigns.find((c: any) => c.id === id);
      setCampaign(foundCampaign);
    }
  }, [id]);

  // Konstanta
  const MIN_DONATION = 10000;
  const MAX_DONATION = 100000000;
  const quickAmounts = [25000, 50000, 100000, 250000, 500000];
  
  const steps = [
    { number: 1, title: 'Jumlah Donasi' },
    { number: 2, title: 'Metode Bayar' },
    { number: 3, title: 'Upload Bukti' }
  ];

  // Informasi rekening/akun pembayaran untuk setiap provider
  const paymentAccounts: { [key: string]: { [key: string]: string } } = {
    "BCA": {
      accountNumber: "123-456-7890",
      accountName: "Yayasan Heartify Indonesia",
      type: "Bank Transfer"
    },
    "Mandiri": {
      accountNumber: "098-765-4321", 
      accountName: "Yayasan Heartify Indonesia",
      type: "Bank Transfer"
    },
    "BNI": {
      accountNumber: "567-890-1234",
      accountName: "Yayasan Heartify Indonesia", 
      type: "Bank Transfer"
    },
    "BRI": {
      accountNumber: "345-678-9012",
      accountName: "Yayasan Heartify Indonesia",
      type: "Bank Transfer"
    },
    "CIMB Niaga": {
      accountNumber: "789-012-3456",
      accountName: "Yayasan Heartify Indonesia",
      type: "Bank Transfer"
    },
    "GoPay": {
      accountNumber: "0812-3456-7890",
      accountName: "Heartify Official",
      type: "E-Wallet"
    },
    "OVO": {
      accountNumber: "0812-3456-7890", 
      accountName: "Heartify Official",
      type: "E-Wallet"
    },
    "Dana": {
      accountNumber: "0812-3456-7890",
      accountName: "Heartify Official",
      type: "E-Wallet"
    },
    "ShopeePay": {
      accountNumber: "0812-3456-7890",
      accountName: "Heartify Official", 
      type: "E-Wallet"
    },
    "LinkAja": {
      accountNumber: "0812-3456-7890",
      accountName: "Heartify Official",
      type: "E-Wallet"
    }
  };

  if (!campaign) {
    return (
      <div className="not-found">
        <h2>Kampanye tidak ditemukan</h2>
        <Link to="/beranda" className="button button-cream">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const remaining = campaign.target - campaign.collected;
  const progress = Math.min((campaign.collected / campaign.target) * 100, 100);

  // Validasi donasi
  const validateDonation = (amount: number): string | null => {
    if (amount < MIN_DONATION) {
      return `Minimum donasi adalah Rp ${MIN_DONATION.toLocaleString('id-ID')}`;
    }
    if (amount > MAX_DONATION) {
      return "Donasi terlalu besar, silakan hubungi admin";
    }
    return null;
  };

  // Simpan riwayat donasi
  const saveDonationHistory = (donationData: any) => {
    const history = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    const newDonation = {
      id: Date.now().toString(),
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      amount: donationData.amount,
      paymentMethod: donationData.paymentMethod,
      provider: donationData.provider,
      date: new Date().toISOString(),
      status: 'pending', // Status pending menunggu konfirmasi bukti
      receiptNumber: `RC-${Date.now()}`,
      isAnonymous: isAnonymous,
      proofUploaded: !!proofFile,
      accountNumber: paymentAccounts[donationData.provider]?.accountNumber || ''
    };
    
    history.unshift(newDonation);
    localStorage.setItem('donationHistory', JSON.stringify(history));
    return newDonation;
  };

  // Handler untuk upload bukti transfer
  const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setError('Harap upload file gambar (JPG, PNG, etc)');
        return;
      }
      
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }

      setProofFile(file);
      setError('');
      
      // Buat preview gambar
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler functions
  const handleDonateClick = () => {
    setShowModal(true);
    setCurrentStep(1);
    setSelectedPayment("");
    setSelectedProvider("");
    setDonationAmount("");
    setQuickAmount(0);
    setIsAnonymous(false);
    setError("");
    setProofFile(null);
    setProofPreview("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setSelectedPayment("");
    setSelectedProvider("");
    setDonationAmount("");
    setQuickAmount(0);
    setIsAnonymous(false);
    setError("");
    setProofFile(null);
    setProofPreview("");
  };

  const handleQuickAmountSelect = (amount: number) => {
    setQuickAmount(amount);
    setDonationAmount(amount);
    setError("");
  };

  const handlePaymentSelect = (paymentName: string) => {
    setSelectedPayment(paymentName);
    setSelectedProvider("");
    setError("");
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const validationError = validateDonation(Number(donationAmount));
      if (validationError) {
        setError(validationError);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedPayment) {
        setError("Silakan pilih metode pembayaran");
        return;
      }
      if (!selectedProvider) {
        setError("Silakan pilih provider pembayaran");
        return;
      }
      setCurrentStep(3);
    }
    setError("");
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  const handleConfirmDonation = async () => {
    // Validasi final
    const validationError = validateDonation(Number(donationAmount));
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedPayment || !selectedProvider) {
      setError("Silakan lengkapi metode pembayaran");
      return;
    }

    if (!proofFile) {
      setError("Harap upload bukti transfer terlebih dahulu");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Simulasi proses upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simpan riwayat donasi
      const receipt = saveDonationHistory({
        amount: Number(donationAmount),
        paymentMethod: selectedPayment,
        provider: selectedProvider
      });

      // Tampilkan konfirmasi
      alert(
        `Terima kasih! Bukti transfer berhasil diupload!\n\n` +
        `No. Resi: ${receipt.receiptNumber}\n` +
        `Jumlah: Rp ${Number(donationAmount).toLocaleString("id-ID")}\n` +
        `Metode: ${selectedProvider} (${selectedPayment})\n` +
        `Status: Menunggu verifikasi admin\n\n` +
        `Donasi akan diproses setelah bukti transfer diverifikasi.`
      );
      
      handleCloseModal();
    } catch (error) {
      setError('Terjadi kesalahan saat mengupload bukti transfer');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPaymentMethod = campaign.paymentMethods.find(
    (method: any) => method.name === selectedPayment
  );

  return (
    <div className="detail-body">
      {/* Hero Section */}
      <section
        className="detail-hero"
        style={{ backgroundImage: `url(${campaign.image})` }}
      >
        <div className="detail-hero-overlay">
          <h1 className="detail-title">{campaign.title}</h1>
          <span className={`detail-category ${campaign.category.toLowerCase()}`}>
            {campaign.category}
          </span>
        </div>
      </section>

      {/* Info Section */}
      <section className="detail-container">
        <div className="detail-info">
          <h2>Tentang Kampanye</h2>
          <p>{campaign.description}</p>
          <div className="campaign-details">
            <p><strong>Dikelola oleh:</strong> {campaign.admin}</p>
            <p><strong>Penerima Manfaat:</strong> {campaign.beneficiary}</p>
          </div>
        </div>

        <div className="detail-card">
          <p>Target: Rp {campaign.target.toLocaleString("id-ID")}</p>
          <p>Terkumpul: Rp {campaign.collected.toLocaleString("id-ID")}</p>
          <p>Sisa: Rp {remaining.toLocaleString("id-ID")}</p>

          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>

          <button className="button button-dark-full" onClick={handleDonateClick}>
            Donasi Sekarang
          </button>
          <Link to="/beranda" className="back-link">
            ← Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* Donation Modal */}
      {showModal && (
        <div className="donation-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Donasi untuk {campaign.title}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            {/* Progress Steps */}
            <div className="payment-steps">
              {steps.map(step => (
                <div key={step.number} className={`step ${currentStep >= step.number ? 'active' : ''}`}>
                  <div className="step-number">{step.number}</div>
                  <div className="step-title">{step.title}</div>
                </div>
              ))}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Step 1: Jumlah Donasi */}
            {currentStep === 1 && (
              <div className="donation-info">
                <div className="info-item">
                  <div className="info-label">Pilih Jumlah Donasi</div>
                  <div className="donation-amount-section">
                    <div className="quick-amounts">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          className={`quick-amount-button ${
                            quickAmount === amount ? "selected" : ""
                          }`}
                          onClick={() => handleQuickAmountSelect(amount)}
                        >
                          Rp {amount.toLocaleString("id-ID")}
                        </button>
                      ))}
                    </div>
                    <div className="custom-amount">
                      <input
                        type="number"
                        className="donation-input"
                        placeholder="Atau masukkan jumlah lain (Rp)"
                        value={donationAmount}
                        onChange={(e) => {
                          setDonationAmount(Number(e.target.value));
                          setError("");
                        }}
                        min="1000"
                      />
                    </div>
                    <div className="amount-info">
                      <small>Minimum donasi: Rp {MIN_DONATION.toLocaleString('id-ID')}</small>
                    </div>
                  </div>
                </div>

                <div className="anonymous-option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={isAnonymous} 
                      onChange={(e) => setIsAnonymous(e.target.checked)} 
                    />
                    Sembunyikan nama saya (Donasi Anonim)
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Metode Pembayaran */}
            {currentStep === 2 && (
              <div className="donation-info">
                <div className="info-item">
                  <div className="info-label">Pilih Metode Pembayaran</div>
                  <div className="payment-methods">
                    {campaign.paymentMethods.map((method: any) => (
                      <div
                        key={method.name}
                        className={`payment-method ${
                          selectedPayment === method.name ? "selected" : ""
                        }`}
                        onClick={() => handlePaymentSelect(method.name)}
                      >
                        <div className="payment-icon">{method.icon}</div>
                        <div className="payment-name">{method.name}</div>
                      </div>
                    ))}
                  </div>

                  {selectedPaymentMethod && (
                    <div className="provider-selection">
                      <div className="info-label">Pilih {selectedPayment}</div>
                      <div className="providers">
                        {selectedPaymentMethod.providers.map((provider: string) => (
                          <div
                            key={provider}
                            className={`provider-option ${
                              selectedProvider === provider ? "selected" : ""
                            }`}
                            onClick={() => setSelectedProvider(provider)}
                          >
                            {provider}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Informasi Rekening/Account */}
                  {selectedProvider && paymentAccounts[selectedProvider] && (
                    <div className="available-payments">
                      <h3>Informasi Pembayaran</h3>
                      <div className="payment-accounts">
                        <div className="account-info">
                          <div className="account-header">
                            <strong>{selectedProvider}</strong>
                          </div>
                          <div className="account-details">
                            <div>
                              <strong>Nomor {paymentAccounts[selectedProvider].type === 'Bank Transfer' ? 'Rekening' : 'Akun'}:</strong> {paymentAccounts[selectedProvider].accountNumber}
                            </div>
                            <div>
                              <strong>Nama {paymentAccounts[selectedProvider].type === 'Bank Transfer' ? 'Pemilik Rekening' : 'Pemilik Akun'}:</strong> {paymentAccounts[selectedProvider].accountName}
                            </div>
                            <div>
                              <strong>Tipe:</strong> {paymentAccounts[selectedProvider].type}
                            </div>
                          </div>
                          <div className="instructions">
                            <small>
                              <strong>Petunjuk:</strong> Lakukan transfer sesuai jumlah donasi ke {paymentAccounts[selectedProvider].type === 'Bank Transfer' ? 'rekening' : 'akun'} di atas, kemudian upload bukti transfer pada langkah selanjutnya.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Upload Bukti Transfer */}
            {currentStep === 3 && (
              <div className="donation-info">
                <div className="info-item">
                  <div className="info-label">Upload Bukti Transfer</div>
                  
                  {/* Informasi Pembayaran */}
                  {selectedProvider && paymentAccounts[selectedProvider] && (
                    <div className="payment-info">
                      <div className="info-label">Informasi Pembayaran</div>
                      <div className="info-value">
                        <strong>{selectedProvider}:</strong> {paymentAccounts[selectedProvider].accountNumber} - {paymentAccounts[selectedProvider].accountName}
                      </div>
                      <div className="info-value">
                        <strong>Jumlah Donasi:</strong> Rp {Number(donationAmount).toLocaleString("id-ID")}
                      </div>
                    </div>
                  )}

                  {/* Area Upload */}
                  <div className="proof-upload">
                    {!proofPreview ? (
                      <div className="upload-area">
                        <label className="upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofUpload}
                            style={{ display: 'none' }}
                          />
                          <div className="upload-icon">📁</div>
                          <div className="upload-text">
                            <strong>Klik untuk upload bukti transfer</strong>
                            <small>Format: JPG, PNG (Maks. 5MB)</small>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="proof-preview">
                        <img src={proofPreview} alt="Bukti Transfer Preview" />
                        <button 
                          className="change-proof-btn"
                          onClick={() => {
                            setProofFile(null);
                            setProofPreview("");
                          }}
                        >
                          Ganti File
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="confirmation-note">
                    <p>
                      <strong>Pastikan bukti transfer menunjukkan:</strong><br />
                      - Nomor {paymentAccounts[selectedProvider]?.type === 'Bank Transfer' ? 'rekening' : 'akun'} tujuan<br />
                      - Nama {paymentAccounts[selectedProvider]?.type === 'Bank Transfer' ? 'pemilik rekening' : 'pemilik akun'}<br />
                      - Jumlah transfer sesuai donasi<br />
                      - Tanggal dan waktu transfer
                    </p>
                  </div>
                </div>

                <div className="anonymous-option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={isAnonymous} 
                      onChange={(e) => setIsAnonymous(e.target.checked)} 
                    />
                    Sembunyikan nama saya (Donasi Anonim)
                  </label>
                </div>
              </div>
            )}

            <div className="modal-actions">
              {currentStep > 1 ? (
                <button className="button-cancel" onClick={handlePrevStep} disabled={isProcessing}>
                  Kembali
                </button>
              ) : (
                <button className="button-cancel" onClick={handleCloseModal} disabled={isProcessing}>
                  Batal
                </button>
              )}
              
              {currentStep < 3 ? (
                <button className="button-confirm" onClick={handleNextStep} disabled={isProcessing}>
                  Lanjut
                </button>
              ) : (
                <button 
                  className="button-confirm" 
                  onClick={handleConfirmDonation} 
                  disabled={isProcessing || !proofFile}
                >
                  {isProcessing ? "Mengupload..." : "Konfirmasi & Upload Bukti"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailKampanye;