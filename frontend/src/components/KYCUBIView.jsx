import React, { useState } from 'react';
import { Shield, CheckCircle, Clock, AlertCircle, Zap, ArrowRight } from 'lucide-react';

export default function KYCUBIView() {
  const [kycStep, setKycStep] = useState(0); // 0: Start, 1: In Progress, 2: Complete
  const [kycStatus, setKycStatus] = useState({
    emailVerified: false,
    phoneVerified: false,
    identityVerified: false,
  });

  const [ubiClaimStatus, setUbiClaimStatus] = useState({
    claimable: true,
    lastClaimDate: null,
    nextClaimDate: null,
    dailyAmount: 0,
  });

  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  // Handle KYC Step
  const handleKYCStep = async (stepType) => {
    try {
      setKycStep(1); // Show loading state
      
      // Simulate API call to backend for KYC verification
      setTimeout(() => {
        if (stepType === 'email') {
          setKycStatus(prev => ({ ...prev, emailVerified: true }));
        } else if (stepType === 'phone') {
          setKycStatus(prev => ({ ...prev, phoneVerified: true }));
        } else if (stepType === 'identity') {
          setKycStatus(prev => ({ ...prev, identityVerified: true }));
        }
        setKycStep(2);
        setTimeout(() => setKycStep(0), 2000);
      }, 1500);
    } catch (error) {
      console.error('KYC verification error:', error);
    }
  };

  // Handle Daily UBI Claim
  const handleClaimUBI = async () => {
    try {
      setShowClaimSuccess(false);
      
      // Simulate API call to GoodDollar backend for UBI claim
      const response = await fetch('http://localhost:5001/api/claim-ubi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorUsername: localStorage.getItem('creatorUsername') || 'creator',
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUbiClaimStatus({
          claimable: false,
          lastClaimDate: new Date(),
          nextClaimDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          dailyAmount: data.amount || 0,
        });
        setShowClaimSuccess(true);
        setTimeout(() => setShowClaimSuccess(false), 4000);
      }
    } catch (error) {
      console.error('UBI claim error:', error);
      alert('Failed to claim UBI. Make sure the backend server is running.');
    }
  };

  const isKycComplete = kycStatus.emailVerified && kycStatus.phoneVerified && kycStatus.identityVerified;

  return (
    <div className="kyc-ubi-view">
      <div className="kyc-header">
        <span className="tag-mono">Verification & Rewards</span>
        <h1 className="page-title">KYC Protocol & Daily UBI</h1>
        <p className="page-subtitle">Complete your identity verification to unlock daily GoodDollar rewards</p>
      </div>

      {/* KYC Section */}
      <section className="kyc-section glass-card">
        <div className="section-header">
          <Shield size={24} className="icon-primary" />
          <div>
            <h2>Know Your Customer (KYC)</h2>
            <p>Verify your identity to access GoodDollar features</p>
          </div>
        </div>

        <div className="kyc-steps">
          {/* Email Verification */}
          <div className={`kyc-step ${kycStatus.emailVerified ? 'completed' : ''}`}>
            <div className="step-status">
              {kycStatus.emailVerified ? (
                <CheckCircle size={20} className="status-icon success" />
              ) : (
                <div className="step-number">1</div>
              )}
            </div>
            <div className="step-content">
              <h3>Email Verification</h3>
              <p>Confirm your email address</p>
            </div>
            {!kycStatus.emailVerified && (
              <button 
                className="btn-secondary"
                onClick={() => handleKYCStep('email')}
                disabled={kycStep === 1}
              >
                {kycStep === 1 ? 'Verifying...' : 'Verify Email'}
              </button>
            )}
          </div>

          {/* Phone Verification */}
          <div className={`kyc-step ${kycStatus.phoneVerified ? 'completed' : ''}`}>
            <div className="step-status">
              {kycStatus.phoneVerified ? (
                <CheckCircle size={20} className="status-icon success" />
              ) : (
                <div className="step-number">2</div>
              )}
            </div>
            <div className="step-content">
              <h3>Phone Verification</h3>
              <p>Confirm your phone number via SMS</p>
            </div>
            {!kycStatus.phoneVerified && (
              <button 
                className="btn-secondary"
                onClick={() => handleKYCStep('phone')}
                disabled={kycStep === 1}
              >
                {kycStep === 1 ? 'Verifying...' : 'Verify Phone'}
              </button>
            )}
          </div>

          {/* Identity Verification */}
          <div className={`kyc-step ${kycStatus.identityVerified ? 'completed' : ''}`}>
            <div className="step-status">
              {kycStatus.identityVerified ? (
                <CheckCircle size={20} className="status-icon success" />
              ) : (
                <div className="step-number">3</div>
              )}
            </div>
            <div className="step-content">
              <h3>Identity Verification</h3>
              <p>Verify with government-issued ID</p>
            </div>
            {!kycStatus.identityVerified && (
              <button 
                className="btn-secondary"
                onClick={() => handleKYCStep('identity')}
                disabled={kycStep === 1}
              >
                {kycStep === 1 ? 'Verifying...' : 'Verify Identity'}
              </button>
            )}
          </div>
        </div>

        {/* KYC Status Badge */}
        <div className="kyc-status-badge">
          {isKycComplete ? (
            <div className="status-complete">
              <CheckCircle size={18} />
              <span>KYC Verification Complete</span>
            </div>
          ) : (
            <div className="status-incomplete">
              <AlertCircle size={18} />
              <span>Complete all steps to unlock UBI claiming</span>
            </div>
          )}
        </div>
      </section>

      {/* Daily UBI Claiming Section */}
      <section className="ubi-section glass-card">
        <div className="section-header">
          <Zap size={24} className="icon-primary" />
          <div>
            <h2>Daily UBI Claim</h2>
            <p>Claim your daily GoodDollar (G$) Universal Basic Income</p>
          </div>
        </div>

        {!isKycComplete ? (
          <div className="ubi-locked">
            <div className="lock-icon">🔒</div>
            <h3>UBI Claiming Locked</h3>
            <p>Complete your KYC verification above to unlock daily UBI claiming</p>
            <div className="lock-steps">
              <span>{kycStatus.emailVerified ? '✓' : '○'} Email Verified</span>
              <span>{kycStatus.phoneVerified ? '✓' : '○'} Phone Verified</span>
              <span>{kycStatus.identityVerified ? '✓' : '○'} Identity Verified</span>
            </div>
          </div>
        ) : (
          <div className="ubi-claim-panel">
            {ubiClaimStatus.claimable ? (
              <>
                <div className="claim-ready">
                  <h3>Ready to Claim</h3>
                  <p className="daily-amount">
                    <span className="currency">G$</span>
                    <span className="amount">1.00</span>
                  </p>
                  <p className="claim-description">Your daily UBI is ready to be claimed</p>
                </div>

                <button 
                  className="btn-primary claim-button"
                  onClick={handleClaimUBI}
                >
                  <Zap size={18} />
                  Claim Daily UBI
                  <ArrowRight size={18} />
                </button>

                <div className="claim-info">
                  <Clock size={16} />
                  <p>Next claim available in 24 hours</p>
                </div>
              </>
            ) : (
              <>
                <div className="claim-cooldown">
                  <h3>Claim Cooldown Active</h3>
                  <p>You've already claimed today. Come back tomorrow!</p>
                  {ubiClaimStatus.lastClaimDate && (
                    <div className="claim-times">
                      <div className="time-item">
                        <span className="label">Last Claimed:</span>
                        <span className="value">
                          {new Date(ubiClaimStatus.lastClaimDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="time-item">
                        <span className="label">Next Available:</span>
                        <span className="value">
                          {ubiClaimStatus.nextClaimDate 
                            ? new Date(ubiClaimStatus.nextClaimDate).toLocaleDateString()
                            : 'Tomorrow'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {showClaimSuccess && (
              <div className="claim-success-toast">
                <CheckCircle size={20} />
                <span>Successfully claimed 1.00 G$!</span>
              </div>
            )}
          </div>
        )}

        {/* UBI Info */}
        <div className="ubi-info">
          <div className="info-card">
            <h4>What is UBI?</h4>
            <p>Universal Basic Income is GoodDollar's initiative to provide economic opportunity for all. Verified users receive daily G$ tokens in their wallet.</p>
          </div>
          <div className="info-card">
            <h4>How to Use G$</h4>
            <p>Use your claimed G$ to tip creators on this platform, trade on DEXs, or transfer to other GoodWallet users.</p>
          </div>
        </div>
      </section>

      <style>{`
        .kyc-ubi-view {
          padding: 48px 32px;
          max-width: 900px;
          margin: 0 auto;
        }

        .kyc-header {
          margin-bottom: 48px;
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 16px;
          margin-top: 12px;
        }

        .kyc-section,
        .ubi-section {
          margin-bottom: 32px;
          padding: 32px;
          border: 1px solid rgba(66, 225, 0, 0.1);
          border-radius: 16px;
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(8px);
        }

        .section-header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .section-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .section-header p {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 4px 0 0 0;
        }

        .icon-primary {
          color: #42e100;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* KYC Steps */
        .kyc-steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .kyc-step {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid rgba(66, 225, 0, 0.15);
          border-radius: 12px;
          background: rgba(66, 225, 0, 0.02);
          transition: all 0.3s ease;
        }

        .kyc-step.completed {
          background: rgba(66, 225, 0, 0.08);
          border-color: rgba(66, 225, 0, 0.3);
        }

        .step-status {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(66, 225, 0, 0.1);
          border: 2px solid rgba(66, 225, 0, 0.3);
          flex-shrink: 0;
        }

        .step-number {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        .status-icon.success {
          color: #42e100;
        }

        .step-content {
          flex: 1;
        }

        .step-content h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .step-content p {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .btn-secondary {
          padding: 8px 16px;
          border: 1px solid rgba(66, 225, 0, 0.3);
          border-radius: 8px;
          background: transparent;
          color: #42e100;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(66, 225, 0, 0.1);
          border-color: rgba(66, 225, 0, 0.5);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .kyc-status-badge {
          padding: 16px;
          border-radius: 12px;
          background: rgba(66, 225, 0, 0.05);
          border: 1px solid rgba(66, 225, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-complete,
        .status-incomplete {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 14px;
        }

        .status-complete {
          color: #42e100;
        }

        .status-incomplete {
          color: var(--text-secondary);
        }

        /* UBI Section */
        .ubi-locked {
          text-align: center;
          padding: 32px;
          background: rgba(66, 225, 0, 0.03);
          border: 1px dashed rgba(66, 225, 0, 0.2);
          border-radius: 12px;
        }

        .lock-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .ubi-locked h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: var(--text-primary);
        }

        .ubi-locked p {
          margin: 0 0 16px 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .lock-steps {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .ubi-claim-panel {
          position: relative;
        }

        .claim-ready {
          text-align: center;
          margin-bottom: 24px;
          padding: 32px;
          background: rgba(66, 225, 0, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(66, 225, 0, 0.15);
        }

        .claim-ready h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: var(--text-secondary);
        }

        .daily-amount {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
          margin: 0 0 8px 0;
        }

        .currency {
          font-size: 24px;
          font-weight: 600;
          color: #42e100;
        }

        .amount {
          font-size: 48px;
          font-weight: 700;
          color: #42e100;
        }

        .claim-description {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .claim-button {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #42e100 0%, #35b300 100%);
          color: #050505;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .claim-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(66, 225, 0, 0.3);
        }

        .claim-button:active {
          transform: translateY(0);
        }

        .claim-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .claim-cooldown {
          text-align: center;
          padding: 32px;
          background: rgba(100, 100, 100, 0.05);
          border: 1px solid rgba(100, 100, 100, 0.2);
          border-radius: 12px;
        }

        .claim-cooldown h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: var(--text-primary);
        }

        .claim-cooldown p {
          margin: 0 0 16px 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .claim-times {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .time-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
        }

        .time-item .label {
          color: var(--text-secondary);
        }

        .time-item .value {
          color: #42e100;
          font-weight: 600;
        }

        .claim-success-toast {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(66, 225, 0, 0.15);
          border: 1px solid rgba(66, 225, 0, 0.4);
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #42e100;
          font-size: 14px;
          font-weight: 500;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* UBI Info Cards */
        .ubi-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .info-card {
          padding: 16px;
          border: 1px solid rgba(66, 225, 0, 0.15);
          border-radius: 12px;
          background: rgba(66, 225, 0, 0.02);
        }

        .info-card h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-card p {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .kyc-ubi-view {
            padding: 32px 16px;
          }

          .kyc-section,
          .ubi-section {
            padding: 24px;
          }

          .kyc-step {
            flex-wrap: wrap;
          }

          .daily-amount {
            flex-direction: column;
            gap: 4px;
          }

          .amount {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
}
