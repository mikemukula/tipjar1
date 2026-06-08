import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.json');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Database JSON file if it doesn't exist
const initialData = {
  creator: {
    name: 'Nuwayama',
    username: 'nuwayama',
    bio: 'Sharing authentic Ugandan food recipes from Kampala. Your G$ tips help buy fresh local ingredients!',
    youtube: 'https://youtube.com/c/nuwayama',
    twitter: 'https://twitter.com/nuwayama',
    instagram: 'https://instagram.com/nuwayama'
  },
  creators: [
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
  ],
  tips: [
    {
      sender: 'Alice K.',
      address: '0x321a...d93e',
      amount: 25,
      message: 'The Rolex (street food) recipe was incredible! 🔥 Tried it this morning.',
      date: 'Jun 5, 2026, 10:15 AM'
    },
    {
      sender: 'Kev_Celo',
      address: '0x992b...fa10',
      amount: 100,
      message: 'Amazing content. Excited to see more local chefs using GoodDollar UBI!',
      date: 'Jun 4, 2026, 8:43 PM'
    },
    {
      sender: 'Shreya',
      address: '0x00f1...89a1',
      amount: 50,
      message: 'Greetings from Kenya! Love the presentation.',
      date: 'Jun 4, 2026, 2:12 PM'
    }
  ]
};

const readDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return initialData;
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
};

// API Endpoints

// 1. Get current creator profile
app.get('/api/profile', (req, res) => {
  const db = readDB();
  res.json(db.creator);
});

// 2. Save/Update creator profile
app.post('/api/profile', (req, res) => {
  const db = readDB();
  db.creator = { ...db.creator, ...req.body };
  writeDB(db);
  res.json({ success: true, profile: db.creator });
});

// 3. Get all tips
app.get('/api/tips', (req, res) => {
  const db = readDB();
  res.json(db.tips);
});

// 3b. Get all creators for spotlight
app.get('/api/creators', (req, res) => {
  const db = readDB();
  // Sort creators by totalTips in descending order and assign ranks
  const sortedCreators = (db.creators || [])
    .sort((a, b) => b.totalTips - a.totalTips)
    .map((creator, index) => ({
      ...creator,
      rank: index + 1
    }));
  res.json(sortedCreators);
});

// 4. Add a new tip
app.post('/api/tips', (req, res) => {
  const db = readDB();
  const newTip = {
    sender: req.body.sender || 'Anonymous Fan',
    address: req.body.address || '0x' + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('...') + Array.from({length: 4}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    amount: parseInt(req.body.amount) || 0,
    message: req.body.message || 'Supported the creator!',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  db.tips = [newTip, ...db.tips];
  writeDB(db);
  res.json({ success: true, tip: newTip });
});

// Claim Daily UBI Endpoint
app.post('/api/claim-ubi', (req, res) => {
  const creatorUsername = req.body.creatorUsername || 'unknown';
  const claimAmount = 1.00; // Daily UBI amount in G$
  
  // In a real implementation, this would:
  // 1. Verify user is KYC verified
  // 2. Check last claim time (24h cooldown)
  // 3. Call GoodDollar API to mint G$ tokens
  // 4. Update blockchain ledger
  
  // For now, return success with mock data
  res.json({
    success: true,
    amount: claimAmount,
    currency: 'G$',
    username: creatorUsername,
    claimTime: new Date().toISOString(),
    nextClaimTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    message: `Successfully claimed ${claimAmount} G$ from your daily UBI allocation!`
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
