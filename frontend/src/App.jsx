import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TipPageView from './components/TipPageView';
import KYCUBIView from './components/KYCUBIView';
import SpotlightView from './components/SpotlightView';

const BACKEND_URL = 'http://localhost:5001';

export default function App() {
  // Creator Profile State (Initial blank states, loaded from backend)
  const [creatorInfo, setCreatorInfo] = useState({
    name: '',
    username: '',
    bio: '',
    youtube: '',
    twitter: ''
  });

  // Tips History Ledger State
  const [mockTips, setMockTips] = useState([]);

  // Routing State
  const [currentView, setView] = useState('dashboard'); // 'dashboard', 'preview', 'how-it-works'
  const [routeInfo, setRouteInfo] = useState({ route: 'app', param: null });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Creator Info & Tips on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch profile
        const profileRes = await fetch(`${BACKEND_URL}/api/profile`);
        const profileData = await profileRes.json();
        setCreatorInfo(profileData);

        // Fetch tips
        const tipsRes = await fetch(`${BACKEND_URL}/api/tips`);
        const tipsData = await tipsRes.json();
        setMockTips(tipsData);
      } catch (error) {
        console.error('Error fetching data from backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Custom Hash Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/tip/')) {
        const username = hash.replace('#/tip/', '');
        setRouteInfo({ route: 'tip-page', param: username });
      } else if (hash.startsWith('#/widget/')) {
        const username = hash.replace('#/widget/', '');
        setRouteInfo({ route: 'widget-page', param: username });
      } else {
        setRouteInfo({ route: 'app', param: null });
        // Set standard internal view if navigated back
        if (hash === '#/preview') {
          setView('preview');
        } else if (hash === '#/how-it-works') {
          setView('how-it-works');
        } else if (hash === '#/kyc-ubi') {
          setView('kyc-ubi');
        } else if (hash === '#/spotlight') {
          setView('spotlight');
        } else {
          setView('dashboard');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Trigger initial routing

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when internal view changes
  const handleSetView = (viewId) => {
    setView(viewId);
    if (viewId === 'dashboard') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${viewId}`;
    }
  };

  // Save Creator Profile to Backend
  const handleSaveProfile = async (updatedProfile) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
      const data = await response.json();
      if (data.success) {
        setCreatorInfo(data.profile);
        alert('Changes saved to backend database successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Make sure the backend server is running.');
    }
  };

  // Add new tip in Backend
  const handleAddTip = async (newTip) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTip),
      });
      const data = await response.json();
      if (data.success) {
        // Update local state with the backend-processed tip
        setMockTips(prev => [data.tip, ...prev]);
      }
    } catch (error) {
      console.error('Error saving tip to backend:', error);
      // Fallback: update local state if backend is down
      setMockTips(prev => [newTip, ...prev]);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen bg-grid">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)' }}>Loading Tipping Studio...</p>
        <style>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-primary);
          }
        `}</style>
      </div>
    );
  }

  // Render standalone tip page (no sidebar)
  if (routeInfo.route === 'tip-page') {
    return (
      <div className="bg-grid">
        <div className="standalone-page-wrap">
          <TipPageView creatorInfo={creatorInfo} onAddTip={handleAddTip} />
        </div>
        <style>{`
          .standalone-page-wrap {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
        `}</style>
      </div>
    );
  }

  // Render standalone widget page (no sidebar, compact layout)
  if (routeInfo.route === 'widget-page') {
    return (
      <div className="widget-wrapper">
        <TipPageView creatorInfo={creatorInfo} onAddTip={handleAddTip} isWidget={true} />
        <style>{`
          .widget-wrapper {
            background: #050505;
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: flex-start;
          }
        `}</style>
      </div>
    );
  }

  // Render main app layout (with sidebar)
  return (
    <div className="app-container">
      <div className="bg-grid"></div>
      
      <Sidebar 
        currentView={currentView} 
        setView={handleSetView} 
        creatorInfo={creatorInfo} 
      />

      <main className="main-content">
        {currentView === 'dashboard' && (
          <DashboardView 
            creatorInfo={creatorInfo} 
            setCreatorInfo={setCreatorInfo} 
            mockTips={mockTips}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {currentView === 'preview' && (
          <div className="preview-container">
            <div className="preview-banner">
              <span className="tag-mono">Preview Mode</span>
              <h2>Tipping Page Live Preview</h2>
              <p>This is what your fans see. Try out the tipping flow to see updates in your dashboard ledger!</p>
            </div>
            <TipPageView creatorInfo={creatorInfo} onAddTip={handleAddTip} />
          </div>
        )}

        {currentView === 'how-it-works' && (
          <div className="how-it-works-wrap">
            <span className="tag-mono">Information Hub</span>
            <h1 className="page-title">How it Works</h1>
            
            <div className="glass-card info-card">
              <h3>The Creator Ecosystem</h3>
              <p>
                The GoodDollar Tip Jar makes it easy for Web3 users to support their favorite digital creators 
                directly using their G$ Universal Basic Income (UBI).
              </p>
              
              <div className="steps-flow">
                <div className="flow-step">
                  <div className="step-num">01</div>
                  <h4>Register Your Handle</h4>
                  <p>Secure a direct tipping handle like <code>tip.gd/name</code>. In production, this stores your credentials on the Celo blockchain registry.</p>
                </div>
                <div className="flow-step">
                  <div className="step-num">02</div>
                  <h4>Distribute & Share</h4>
                  <p>Display your QR code on video streams or bios. Embed the glassmorphic HTML widget onto your website.</p>
                </div>
                <div className="flow-step">
                  <div className="step-num">03</div>
                  <h4>Earn Peer-to-Peer</h4>
                  <p>Fans tip you in G$ directly from their GoodWallet. The transfer goes wallet-to-wallet on Celo, completely fee-free.</p>
                </div>
              </div>
            </div>

            <div className="glass-card faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-item">
                <h4>Why use G$ for tipping?</h4>
                <p>GoodDollar provides daily UBI tokens globally. Allowing fans to tip in G$ gives immediate utility to UBI tokens and creates a circular economy between creators and fans.</p>
              </div>
              <div className="faq-item">
                <h4>What fees are taken from tips?</h4>
                <p>Zero fees. Unlike platforms like PayPal or Patreon that take 3-10% in processing fees, blockchain transactions are peer-to-peer, so you keep 100% of your tips.</p>
              </div>
              <div className="faq-item">
                <h4>How does GoodWallet connect?</h4>
                <p>In the fully integrated version, users tap "Send Tip" which opens a WalletConnect prompt. They scan the QR code using their GoodWallet on their phone to securely sign the transaction.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'kyc-ubi' && (
          <KYCUBIView />
        )}

        {currentView === 'spotlight' && (
          <SpotlightView />
        )}
      </main>

      <style>{`
        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .preview-banner {
          text-align: center;
          max-width: 600px;
          margin-bottom: 8px;
        }

        .preview-banner h2 {
          font-family: var(--font-mono);
          font-size: 1.75rem;
          margin-top: 4px;
        }

        .preview-banner p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 8px;
        }

        .how-it-works-wrap {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-family: var(--font-mono);
          font-size: 2.25rem;
          margin-bottom: 24px;
          margin-top: 4px;
        }

        .info-card {
          margin-bottom: 24px;
        }

        .info-card h3 {
          font-family: var(--font-mono);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .info-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .steps-flow {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .flow-step {
          position: relative;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-glass);
          border-radius: 12px;
          padding: 20px;
        }

        .step-num {
          font-family: var(--font-mono);
          font-size: 2.5rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.04);
          position: absolute;
          top: 10px;
          right: 16px;
        }

        .flow-step h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
          position: relative;
        }

        .flow-step p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0;
        }

        .faq-section h3 {
          font-family: var(--font-mono);
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .faq-item {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 20px;
        }

        .faq-item:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .faq-item h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .faq-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .steps-flow {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
