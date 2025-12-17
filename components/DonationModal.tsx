// components/DonationModal.tsx
"use client";

import React, { useState, useEffect } from "react";

interface DonationModalProps {
    campaignId: string;
    campaignTitle: string;
    onClose: () => void;
    onSuccess: () => void; // Callback untuk me-refresh data di halaman detail
}

interface Donor {
    name: string;
    email: string;
}

const MIN_DONATION = 10000;
const MAX_DONATION = 100000000;
const quickAmounts = [25000, 50000, 100000, 250000, 500000];

// Data Pembayaran Statis (Harus sama dengan paymentAccounts di kode Anda)
const paymentAccounts: { [key: string]: { accountNumber: string, accountName: string, type: string } } = {
    "BCA": { accountNumber: "123-456-7890", accountName: "Yayasan Heartify Indonesia", type: "Bank Transfer" },
    "Mandiri": { accountNumber: "098-765-4321", accountName: "Yayasan Heartify Indonesia", type: "Bank Transfer" },
    "BNI": { accountNumber: "567-890-1234", accountName: "Yayasan Heartify Indonesia", type: "Bank Transfer" },
    "BRI": { accountNumber: "345-678-9012", accountName: "Yayasan Heartify Indonesia", type: "Bank Transfer" },
    "CIMB Niaga": { accountNumber: "789-012-3456", accountName: "Yayasan Heartify Indonesia", type: "Bank Transfer" },
    "GoPay": { accountNumber: "0812-3456-7890", accountName: "Heartify Official", type: "E-Wallet" },
    "OVO": { accountNumber: "0812-3456-7890", accountName: "Heartify Official", type: "E-Wallet" },
    "Dana": { accountNumber: "0812-3456-7890", accountName: "Heartify Official", type: "E-Wallet" },
};

// Metode Pembayaran yang tersedia (Contoh struktur)
const availablePaymentMethods = [
    { name: 'Bank Transfer', providers: ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga"] },
    { name: 'E-Wallet', providers: ["GoPay", "OVO", "Dana"] },
];

const steps = [
    { number: 1, title: 'Jumlah Donasi' },
    { number: 2, title: 'Metode Bayar' },
    { number: 3, title: 'Upload Bukti' }
];

const DonationModal: React.FC<DonationModalProps> = ({ campaignId, campaignTitle, onClose, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [selectedProvider, setSelectedProvider] = useState("");
    const [donationAmount, setDonationAmount] = useState<number | string>("");
    const [quickAmount, setQuickAmount] = useState<number>(0);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string>("");
    const [donor, setDonor] = useState<Donor | null>(null);

    // Ambil data user dari localStorage
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setDonor({ name: user.name, email: user.email });
        }
    }, []);

    const selectedPaymentMethod = availablePaymentMethods.find(
        (method) => method.name === selectedPayment
    );

    const validateDonation = (amount: number): string | null => {
        if (amount < MIN_DONATION) {
            return `Minimum donasi adalah Rp ${MIN_DONATION.toLocaleString('id-ID')}`;
        }
        if (amount > MAX_DONATION) {
            return "Donasi terlalu besar, silakan hubungi admin";
        }
        return null;
    };

    const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Harap upload file gambar (JPG, PNG, etc)');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Ukuran file maksimal 5MB');
                return;
            }

            setProofFile(file);
            setError('');
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setProofPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
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
            const amount = Number(donationAmount);
            const validationError = validateDonation(amount);
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

    // --- LOGIC API DARI SINI ---
    const handleConfirmDonation = async () => {
        const amount = Number(donationAmount);

        if (!proofFile) {
            setError("Harap upload bukti transfer terlebih dahulu");
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            // 1. Buat FormData untuk mengirim data dan file
            const formData = new FormData();
            formData.append('campaignId', campaignId);
            formData.append('amount', amount.toString());
            // Gunakan data donor dari state
            formData.append('donorName', isAnonymous ? 'Anonim' : donor?.name || 'Anonim');
            formData.append('donorEmail', donor?.email || 'anonim@donasi.org');
            formData.append('paymentMethod', selectedPayment);
            formData.append('provider', selectedProvider);
            formData.append('proofFile', proofFile); 
            
            // 2. Kirim ke API submit
            const res = await fetch("/api/donations/submit", {
                method: "POST",
                body: formData, 
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || `API Error: HTTP ${res.status}`);
            }

            // Tampilkan konfirmasi
            alert(
                `🎉 Donasi Berhasil! No. Resi: ${data.donation.receiptNumber}\n\n` +
                `Status: Menunggu verifikasi admin\n\n` +
                `Donasi Anda akan segera diproses.`
            );
            
            onSuccess(); // Panggil refresh data di halaman detail
            onClose(); // Tutup modal

        } catch (err: any) {
            console.error("Donation Confirmation Error:", err);
            setError(err.message || 'Terjadi kesalahan saat konfirmasi donasi.');
        } finally {
            setIsProcessing(false);
        }
    };
    // --- AKHIR LOGIC API ---


    return (
        <div className="donation-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Donasi untuk {campaignTitle}</h2>
                    <button className="close-button" onClick={onClose} disabled={isProcessing}>
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
                        {/* Render form step 1 - sesuai kode Anda */}
                        <div className="info-item">
                            <div className="info-label">Pilih Jumlah Donasi</div>
                            <div className="donation-amount-section">
                                <div className="quick-amounts">
                                    {quickAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            className={`quick-amount-button ${quickAmount === amount ? "selected" : ""}`}
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
                                        min={MIN_DONATION}
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
                                {availablePaymentMethods.map((method: any) => (
                                    <div
                                        key={method.name}
                                        className={`payment-method ${selectedPayment === method.name ? "selected" : ""}`}
                                        onClick={() => handlePaymentSelect(method.name)}
                                    >
                                        <div className="payment-icon">{method.name.includes('Bank') ? '🏦' : '💳'}</div>
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
                                                className={`provider-option ${selectedProvider === provider ? "selected" : ""}`}
                                                onClick={() => setSelectedProvider(provider)}
                                            >
                                                {provider}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                                    <strong>Petunjuk:</strong> Lakukan transfer sebesar **Rp {Number(donationAmount).toLocaleString("id-ID")}** ke {paymentAccounts[selectedProvider].type === 'Bank Transfer' ? 'rekening' : 'akun'} di atas, kemudian upload bukti transfer pada langkah selanjutnya.
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
                        <button className="button-cancel" onClick={onClose} disabled={isProcessing}>
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
    );
};

export default DonationModal;