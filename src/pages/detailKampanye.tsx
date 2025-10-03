import React, { useState, useEffect } from "react";
import { useParams, Link, } from "react-router-dom";
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
    { number: 3, title: 'Konfirmasi' }
  ];

  // Informasi metode pembayaran
  const paymentMethodsInfo = {
    "Bank Transfer": {
      description: "Transfer melalui ATM/Internet Banking/Mobile Banking",
      processingTime: "1-2 jam kerja",
      fees: "Rp 0"
    },
    "E-Wallet": {
      description: "Pembayaran instan melalui dompet digital",
      processingTime: "Instan",
      fees: "Rp 0"
    },
    "Credit Card": {
      description: "Pembayaran dengan kartu kredit",
      processingTime: "Instan",
      fees: "2% dari total donasi"
    },
    "Convenience Store": {
      description: "Bayar di gerai Alfamart/Indomaret terdekat",
      processingTime: "1-2 jam kerja",
      fees: "Rp 2.500"
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

  // Hitung biaya admin
  const calculateFees = (amount: number) => {
    let adminFee = 0;
    
    if (selectedPayment === "Credit Card") {
      adminFee = amount * 0.02; // 2% untuk credit card
    } else if (selectedPayment === "Convenience Store") {
      adminFee = 2500; // Flat fee untuk convenience store
    }
    
    const total = amount + adminFee;
    
    return {
      donationAmount: amount,
      adminFee: adminFee,
      totalAmount: total
    };
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
      status: 'completed',
      receiptNumber: `RC-${Date.now()}`,
      isAnonymous: isAnonymous
    };
    
    history.unshift(newDonation);
    localStorage.setItem('donationHistory', JSON.stringify(history));
    return newDonation;
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

    setIsProcessing(true);
    setError("");

    try {
      // Simulasi proses pembayaran
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update campaign data dengan donasi baru
      const updatedCampaigns = campaigns.map(c => {
        if (c.id === campaign.id) {
          return {
            ...c,
            collected: c.collected + Number(donationAmount)
          };
        }
        return c;
      });

      // Simpan ke localStorage
      localStorage.setItem("campaignsData", JSON.stringify(updatedCampaigns));
      
      // Simpan riwayat donasi
      const receipt = saveDonationHistory({
        amount: Number(donationAmount),
        paymentMethod: selectedPayment,
        provider: selectedProvider
      });

      // Update state
      setCampaigns(updatedCampaigns);
      setCampaign({
        ...campaign,
        collected: campaign.collected + Number(donationAmount)
      });

      // Tampilkan receipt
      alert(
        `Terima kasih! Donasi berhasil!\n\n` +
        `No. Resi: ${receipt.receiptNumber}\n` +
        `Jumlah: Rp ${Number(donationAmount).toLocaleString("id-ID")}\n` +
        `Metode: ${selectedProvider} (${selectedPayment})\n` +
        `Status: ${isAnonymous ? 'Donasi Anonim' : 'Donasi Teridentifikasi'}`
      );
      
      handleCloseModal();
    } catch (error) {
      setError('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPaymentMethod = campaign.paymentMethods.find(
    (method: any) => method.name === selectedPayment
  );

  const fees = calculateFees(Number(donationAmount || 0));

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
                        {paymentMethodsInfo[method.name as keyof typeof paymentMethodsInfo] && (
                          <div className="payment-info">
                            <small>{paymentMethodsInfo[method.name as keyof typeof paymentMethodsInfo].fees}</small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedPaymentMethod && (
                    <div className="provider-selection">
                      <div className="info-label">Pilih {selectedPayment}</div>
                      {paymentMethodsInfo[selectedPayment as keyof typeof paymentMethodsInfo] && (
                        <div className="payment-description">
                          <small>{paymentMethodsInfo[selectedPayment as keyof typeof paymentMethodsInfo].description}</small>
                        </div>
                      )}
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
                </div>
              </div>
            )}

            {/* Step 3: Konfirmasi */}
            {currentStep === 3 && (
              <div className="donation-info">
                <div className="info-item">
                  <div className="info-label">Ringkasan Donasi</div>
                  <div className="donation-receipt">
                    <div className="receipt-item">
                      <span>Kampanye:</span>
                      <span>{campaign.title}</span>
                    </div>
                    <div className="receipt-item">
                      <span>Jumlah Donasi:</span>
                      <span>Rp {Number(donationAmount).toLocaleString("id-ID")}</span>
                    </div>
                    {fees.adminFee > 0 && (
                      <div className="receipt-item">
                        <span>Biaya Admin:</span>
                        <span>Rp {fees.adminFee.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    <div className="receipt-item receipt-total">
                      <span>Total Bayar:</span>
                      <span>Rp {fees.totalAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="receipt-item">
                      <span>Metode Pembayaran:</span>
                      <span>{selectedProvider} ({selectedPayment})</span>
                    </div>
                    <div className="receipt-item">
                      <span>Status:</span>
                      <span>{isAnonymous ? 'Donasi Anonim' : 'Donasi Teridentifikasi'}</span>
                    </div>
                  </div>
                </div>

                <div className="confirmation-note">
                  <p>Dengan mengkonfirmasi, Anda menyetujui donasi ini dan proses tidak dapat dibatalkan.</p>
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
                  disabled={isProcessing}
                >
                  {isProcessing ? "Memproses..." : "Konfirmasi Donasi"}
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