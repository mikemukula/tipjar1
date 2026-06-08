import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Heart, Users, Share2, ExternalLink } from 'lucide-react';

export default function SpotlightView() {
  const [topCreators, setTopCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);

  useEffect(() => {
    // Fetch top creators data from backend
    const fetchTopCreators = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5001/api/creators');
        
        if (!response.ok) throw new Error('Failed to fetch creators');
        
        const creators = await response.json();
        setTopCreators(creators);
      } catch (error) {
        console.error('Error fetching creators:', error);
        // Fallback to mock data if backend is unavailable
        const mockCreators = [
          {
            rank: 1,
            name: 'Nuwayama',
            username: 'nuwayama',
            bio: 'Sharing authentic Ugandan food recipes from Kampala',
            totalTips: 175,
            tipCount: 3,
            avatar: '🍳',
            social: {
              youtube: 'https://youtube.com/c/nuwayama',
              twitter: 'https://twitter.com/nuwayama',
              instagram: 'https://instagram.com/nuwayama'
            }
          },
          {
            rank: 2,
            name: 'Alex Rivera',
            username: 'alexrivera',
            bio: 'Digital artist creating NFT illustrations on Celo blockchain',
            totalTips: 450,
            tipCount: 8,
            avatar: '🎨',
            social: {
              youtube: 'https://youtube.com/alexrivera',
              twitter: 'https://twitter.com/alexrivera',
              instagram: 'https://instagram.com/alexrivera_art'
            }
          },
          {
            rank: 3,
            name: 'Sarah Chen',
            username: 'sarahchen',
            bio: 'Web3 educator teaching blockchain to beginners',
            totalTips: 320,
            tipCount: 12,
            avatar: '📚',
            social: {
              youtube: 'https://youtube.com/sarahchen',
              twitter: 'https://twitter.com/sarahchen_web3',
              instagram: 'https://instagram.com/sarahchen.web3'
            }
          },
          {
            rank: 4,
            name: 'Marcus Johnson',
            username: 'marcusj',
            bio: 'Musician streaming live jam sessions daily',
            totalTips: 280,
            tipCount: 15,
            avatar: '🎵',
            social: {
              youtube: 'https://youtube.com/marcusj',
              twitter: 'https://twitter.com/marcusjams',
              instagram: 'https://instagram.com/marcus.johnson.music'
            }
          },
          {
            rank: 5,
            name: 'Elena Rodriguez',
            username: 'elenarod',
            bio: 'Sustainable fashion designer from Costa Rica',
            totalTips: 215,
            tipCount: 7,
            avatar: '👗',
            social: {
              youtube: 'https://youtube.com/elenarod',
              twitter: 'https://twitter.com/erodriguez_eco',
              instagram: 'https://instagram.com/elena_sustainable_fashion'
            }
          },
          {
            rank: 6,
            name: 'James Liu',
            username: 'jamesliu',
            bio: 'DeFi protocol developer sharing technical insights',
            totalTips: 380,
            tipCount: 11,
            avatar: '⚙️',
            social: {
              youtube: 'https://youtube.com/jamesliu_dev',
              twitter: 'https://twitter.com/jamesliu_dev',
              instagram: 'https://instagram.com/jamesliu.dev'
            }
          },
          {
            rank: 7,
            name: 'Amara Okafor',
            username: 'amaraok',
            bio: 'Climate tech entrepreneur building solutions in Nigeria',
            totalTips: 195,
            tipCount: 9,
            avatar: '🌱',
            social: {
              youtube: 'https://youtube.com/amaraok',
              twitter: 'https://twitter.com/amaraokafor',
              instagram: 'https://instagram.com/amara_climatetech'
            }
          },
          {
            rank: 8,
            name: 'Viktor Petrov',
            username: 'viktorpetrov',
            bio: 'Podcast host discussing emerging markets and crypto',
            totalTips: 240,
            tipCount: 6,
            avatar: '🎙️',
            social: {
              youtube: 'https://youtube.com/viktorpetrov',
              twitter: 'https://twitter.com/viktorpetrov',
              instagram: 'https://instagram.com/viktor.petrov.podcast'
            }
          }
        ];
        setTopCreators(mockCreators);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCreators();
  }, []);

  const getMedalIcon = (rank) => {
    switch(rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch(rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'rgba(66, 225, 0, 0.3)';
    }
  };

  if (isLoading) {
    return (
      <div className="spotlight-loading">
        <div className="spinner"></div>
        <p>Loading creator spotlight...</p>
      </div>
    );
  }

  return (
    <div className="spotlight-view">
      {/* Header */}
      <div className="spotlight-header">
        <span className="tag-mono">Creator Economy</span>
        <h1 className="page-title">App Spotlight</h1>
        <p className="page-subtitle">Celebrate the top creators making an impact on the GoodDollar Tip Jar platform</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Active Creators</p>
            <p className="stat-value">{topCreators.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Tips Given</p>
            <p className="stat-value">
              {topCreators.reduce((sum, c) => sum + c.totalTips, 0)} G$
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Community Engagement</p>
            <p className="stat-value">
              {topCreators.reduce((sum, c) => sum + c.tipCount, 0)} tips
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard-section glass-card">
        <div className="leaderboard-header">
          <div className="header-title">
            <TrendingUp size={22} className="icon-primary" />
            <div>
              <h2>Top Creators Leaderboard</h2>
              <p>Ranked by total tips received this month</p>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-creator">Creator</div>
            <div className="col-tips">Total Tips</div>
            <div className="col-count">Tip Count</div>
            <div className="col-action">Action</div>
          </div>

          {topCreators.map((creator) => (
            <div 
              key={creator.rank}
              className={`table-row rank-${creator.rank}`}
              onClick={() => setSelectedCreator(selectedCreator?.rank === creator.rank ? null : creator)}
              style={{ cursor: 'pointer' }}
            >
              <div className="col-rank">
                <div className="rank-badge" style={{ background: getRankBadgeColor(creator.rank) }}>
                  {getMedalIcon(creator.rank) || `#${creator.rank}`}
                </div>
              </div>
              
              <div className="col-creator">
                <div className="creator-card">
                  <div className="creator-avatar">{creator.avatar}</div>
                  <div className="creator-info">
                    <h4 className="creator-name">{creator.name}</h4>
                    <p className="creator-handle">@{creator.username}</p>
                    <p className="creator-bio">{creator.bio}</p>
                  </div>
                </div>
              </div>

              <div className="col-tips">
                <div className="tips-amount">
                  <span className="amount">{creator.totalTips}</span>
                  <span className="currency">G$</span>
                </div>
              </div>

              <div className="col-count">
                <div className="tip-count">
                  <Heart size={14} />
                  <span>{creator.tipCount} tips</span>
                </div>
              </div>

              <div className="col-action">
                <a 
                  href={`#/tip/${creator.username}`}
                  className="btn-visit"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Card View */}
        <div className="leaderboard-cards">
          {topCreators.map((creator) => (
            <div 
              key={creator.rank}
              className={`creator-card-mobile rank-${creator.rank}`}
              onClick={() => setSelectedCreator(selectedCreator?.rank === creator.rank ? null : creator)}
            >
              <div className="card-header">
                <div className="rank-badge-mobile" style={{ background: getRankBadgeColor(creator.rank) }}>
                  {getMedalIcon(creator.rank) || `#${creator.rank}`}
                </div>
                <div className="creator-mini">
                  <h4>{creator.name}</h4>
                  <p>@{creator.username}</p>
                </div>
              </div>

              <p className="card-bio">{creator.bio}</p>

              <div className="card-stats">
                <div className="stat">
                  <span className="value">{creator.totalTips} G$</span>
                  <span className="label">Tips Received</span>
                </div>
                <div className="stat">
                  <span className="value">{creator.tipCount}</span>
                  <span className="label">From Supporters</span>
                </div>
              </div>

              <a 
                href={`#/tip/${creator.username}`}
                className="btn-tip-creator"
              >
                <Heart size={16} />
                Support Creator
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Creator Detail */}
      {selectedCreator && (
        <div className="featured-detail glass-card">
          <div className="featured-header">
            <h3>Creator Spotlight</h3>
            <button 
              className="close-btn"
              onClick={() => setSelectedCreator(null)}
            >
              ✕
            </button>
          </div>

          <div className="featured-content">
            <div className="featured-avatar">{selectedCreator.avatar}</div>
            
            <div className="featured-info">
              <div>
                <h2>{selectedCreator.name}</h2>
                <p className="featured-handle">@{selectedCreator.username}</p>
              </div>

              <p className="featured-bio">{selectedCreator.bio}</p>

              <div className="featured-stats">
                <div className="featured-stat">
                  <Award size={18} />
                  <div>
                    <span className="label">Community Rating</span>
                    <span className="value">
                      {Math.round((selectedCreator.totalTips / selectedCreator.tipCount) * 10) / 10} G$ avg tip
                    </span>
                  </div>
                </div>
                <div className="featured-stat">
                  <Users size={18} />
                  <div>
                    <span className="label">Total Supporters</span>
                    <span className="value">{selectedCreator.tipCount}</span>
                  </div>
                </div>
              </div>

              <div className="featured-social">
                {selectedCreator.social?.youtube && (
                  <a 
                    href={selectedCreator.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link youtube"
                    title="Visit YouTube"
                  >
                    <span>▶️</span>
                    <span>YouTube</span>
                  </a>
                )}
                {selectedCreator.social?.twitter && (
                  <a 
                    href={selectedCreator.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link twitter"
                    title="Visit Twitter/X"
                  >
                    <span>𝕏</span>
                    <span>Twitter</span>
                  </a>
                )}
                {selectedCreator.social?.instagram && (
                  <a 
                    href={selectedCreator.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link instagram"
                    title="Visit Instagram"
                  >
                    <span>📷</span>
                    <span>Instagram</span>
                  </a>
                )}
              </div>

              <a 
                href={`#/tip/${selectedCreator.username}`}
                className="btn-primary featured-btn"
              >
                <Heart size={18} />
                Support This Creator
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="spotlight-info glass-card">
        <h3>How Spotlight Works</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-number">01</div>
            <h4>Create Your Profile</h4>
            <p>Set up your creator profile with name, bio, and social links on your dashboard</p>
          </div>
          <div className="info-item">
            <div className="info-number">02</div>
            <h4>Share Your Link</h4>
            <p>Share your unique tip jar link with your community and fans</p>
          </div>
          <div className="info-item">
            <div className="info-number">03</div>
            <h4>Earn Recognition</h4>
            <p>As fans tip you in G$, you climb the leaderboard and get featured in Spotlight</p>
          </div>
          <div className="info-item">
            <div className="info-number">04</div>
            <h4>Build Community</h4>
            <p>Connect with other creators and grow your audience through the platform</p>
          </div>
        </div>
      </div>

      <style>{`
        .spotlight-view {
          padding: 48px 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .spotlight-loading {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          gap: 16px;
        }

        .spotlight-header {
          margin-bottom: 48px;
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 16px;
          margin-top: 12px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 48px;
        }

        .stat-card {
          padding: 20px;
          border: 1px solid rgba(66, 225, 0, 0.15);
          border-radius: 12px;
          background: rgba(66, 225, 0, 0.03);
          display: flex;
          gap: 16px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: rgba(66, 225, 0, 0.3);
          background: rgba(66, 225, 0, 0.08);
        }

        .stat-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          margin: 0;
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          margin: 4px 0 0 0;
          font-size: 24px;
          font-weight: 700;
          color: #42e100;
        }

        /* Leaderboard */
        .leaderboard-section {
          padding: 32px;
          margin-bottom: 32px;
          border: 1px solid rgba(66, 225, 0, 0.1);
          border-radius: 16px;
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(8px);
        }

        .leaderboard-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .header-title {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          flex: 1;
        }

        .header-title h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .header-title p {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .icon-primary {
          color: #42e100;
          flex-shrink: 0;
        }

        /* Table View */
        .leaderboard-table {
          display: none;
        }

        @media (min-width: 1024px) {
          .leaderboard-table {
            display: block;
          }

          .leaderboard-cards {
            display: none;
          }
        }

        .table-header {
          display: grid;
          grid-template-columns: 60px 1fr 120px 120px 100px;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid rgba(66, 225, 0, 0.15);
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
        }

        .table-row {
          display: grid;
          grid-template-columns: 60px 1fr 120px 120px 100px;
          gap: 16px;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(66, 225, 0, 0.08);
          align-items: center;
          transition: all 0.2s ease;
          border-radius: 8px;
        }

        .table-row:hover {
          background: rgba(66, 225, 0, 0.05);
        }

        .table-row.rank-1 {
          background: rgba(255, 215, 0, 0.08);
        }

        .table-row.rank-2 {
          background: rgba(192, 192, 192, 0.08);
        }

        .table-row.rank-3 {
          background: rgba(205, 127, 50, 0.08);
        }

        .col-rank {
          display: flex;
          justify-content: center;
        }

        .rank-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #050505;
        }

        .col-creator {
          min-width: 0;
        }

        .creator-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .creator-avatar {
          font-size: 28px;
          flex-shrink: 0;
          width: 40px;
          text-align: center;
        }

        .creator-info {
          flex: 1;
          min-width: 0;
        }

        .creator-name {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .creator-handle {
          margin: 2px 0 4px 0;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .creator-bio {
          margin: 0;
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .col-tips {
          text-align: right;
        }

        .tips-amount {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .amount {
          font-size: 16px;
          font-weight: 700;
          color: #42e100;
        }

        .currency {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .col-count {
          text-align: center;
        }

        .tip-count {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .tip-count svg {
          color: #ff6b6b;
        }

        .col-action {
          text-align: center;
        }

        .btn-visit {
          padding: 8px 12px;
          border: 1px solid rgba(66, 225, 0, 0.3);
          border-radius: 8px;
          background: transparent;
          color: #42e100;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .btn-visit:hover {
          background: rgba(66, 225, 0, 0.1);
          border-color: rgba(66, 225, 0, 0.5);
        }

        /* Mobile Card View */
        .leaderboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .creator-card-mobile {
          padding: 20px;
          border: 1px solid rgba(66, 225, 0, 0.15);
          border-radius: 12px;
          background: rgba(66, 225, 0, 0.02);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .creator-card-mobile:hover {
          border-color: rgba(66, 225, 0, 0.3);
          background: rgba(66, 225, 0, 0.08);
          transform: translateY(-4px);
        }

        .creator-card-mobile.rank-1,
        .creator-card-mobile.rank-2,
        .creator-card-mobile.rank-3 {
          border-width: 2px;
        }

        .creator-card-mobile.rank-1 {
          border-color: #FFD700;
        }

        .creator-card-mobile.rank-2 {
          border-color: #C0C0C0;
        }

        .creator-card-mobile.rank-3 {
          border-color: #CD7F32;
        }

        .card-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }

        .rank-badge-mobile {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: #050505;
          flex-shrink: 0;
        }

        .creator-mini {
          flex: 1;
          min-width: 0;
        }

        .creator-mini h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .creator-mini p {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .card-bio {
          margin: 12px 0;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-stats {
          display: flex;
          gap: 16px;
          margin: 16px 0;
          padding: 12px 0;
          border-top: 1px solid rgba(66, 225, 0, 0.1);
          border-bottom: 1px solid rgba(66, 225, 0, 0.1);
        }

        .stat {
          flex: 1;
          text-align: center;
        }

        .stat .value {
          display: block;
          font-size: 16px;
          font-weight: 700;
          color: #42e100;
        }

        .stat .label {
          display: block;
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .btn-tip-creator {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #42e100 0%, #35b300 100%);
          color: #050505;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-tip-creator:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(66, 225, 0, 0.3);
        }

        /* Featured Detail */
        .featured-detail {
          padding: 32px;
          margin-bottom: 32px;
          border: 2px solid rgba(66, 225, 0, 0.2);
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(66, 225, 0, 0.05) 0%, rgba(66, 225, 0, 0.02) 100%);
          backdrop-filter: blur(8px);
        }

        .featured-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .featured-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(66, 225, 0, 0.1);
          color: #42e100;
        }

        .featured-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 32px;
          align-items: start;
        }

        .featured-avatar {
          font-size: 80px;
          text-align: center;
          line-height: 1;
          margin-bottom: 16px;
        }

        .featured-info h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .featured-handle {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #42e100;
        }

        .featured-bio {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .featured-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 24px 0;
          padding: 16px 0;
          border-top: 1px solid rgba(66, 225, 0, 0.1);
          border-bottom: 1px solid rgba(66, 225, 0, 0.1);
        }

        .featured-stat {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .featured-stat svg {
          color: #42e100;
          flex-shrink: 0;
        }

        .featured-stat .label {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .featured-stat .value {
          display: block;
          font-size: 18px;
          font-weight: 600;
          color: #42e100;
          margin-top: 2px;
        }

        .featured-social {
          display: flex;
          gap: 12px;
          margin: 24px 0;
          flex-wrap: wrap;
        }

        .social-link {
          padding: 10px 14px;
          border: 1px solid rgba(66, 225, 0, 0.3);
          border-radius: 8px;
          color: #42e100;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .social-link span:first-child {
          font-size: 14px;
        }

        .social-link:hover {
          background: rgba(66, 225, 0, 0.1);
          border-color: rgba(66, 225, 0, 0.5);
          transform: translateY(-1px);
        }

        .social-link.youtube:hover {
          border-color: #ff0000;
          color: #ff0000;
          background: rgba(255, 0, 0, 0.05);
        }

        .social-link.twitter:hover {
          border-color: #1DA1F2;
          color: #1DA1F2;
          background: rgba(29, 161, 242, 0.05);
        }

        .social-link.instagram:hover {
          border-color: #E1306C;
          color: #E1306C;
          background: rgba(225, 48, 108, 0.05);
        }

        .featured-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #42e100 0%, #35b300 100%);
          color: #050505;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .featured-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(66, 225, 0, 0.3);
        }

        /* Info Section */
        .spotlight-info {
          padding: 32px;
          border: 1px solid rgba(66, 225, 0, 0.1);
          border-radius: 16px;
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(8px);
        }

        .spotlight-info h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .info-item {
          padding: 20px;
          border: 1px solid rgba(66, 225, 0, 0.15);
          border-radius: 12px;
          background: rgba(66, 225, 0, 0.02);
          text-align: center;
        }

        .info-number {
          font-size: 32px;
          font-weight: 700;
          color: #42e100;
          margin-bottom: 8px;
        }

        .info-item h4 {
          margin: 0 0 8px 0;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-item p {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .spotlight-view {
            padding: 32px 16px;
          }

          .featured-content {
            grid-template-columns: 1fr;
          }

          .featured-avatar {
            font-size: 60px;
            margin-bottom: 0;
          }

          .leaderboard-section {
            padding: 20px;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
