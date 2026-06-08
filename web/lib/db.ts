import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

export interface Creator {
  name: string;
  username: string;
  bio: string;
  youtube: string;
  twitter: string;
  walletAddress?: string;
}

export interface Tip {
  sender: string;
  address: string;
  amount: number;
  message: string;
  date: string;
}

export interface DB {
  creator: Creator;
  tips: Tip[];
}

const initialData: DB = {
  creator: {
    name: 'Nuwayama',
    username: 'nuwayama',
    bio: 'Sharing authentic Ugandan food recipes from Kampala. Your G$ tips help buy fresh local ingredients!',
    youtube: 'https://youtube.com/c/nuwayama',
    twitter: 'https://twitter.com/nuwayama',
    walletAddress: '',
  },
  tips: [
    {
      sender: 'Alice K.',
      address: '0x321a...d93e',
      amount: 25,
      message: 'The Rolex (street food) recipe was incredible! 🔥 Tried it this morning.',
      date: 'Jun 5, 2026, 10:15 AM',
    },
    {
      sender: 'Kev_Celo',
      address: '0x992b...fa10',
      amount: 100,
      message: 'Amazing content. Excited to see more local chefs using GoodDollar UBI!',
      date: 'Jun 4, 2026, 8:43 PM',
    },
    {
      sender: 'Shreya',
      address: '0x00f1...89a1',
      amount: 50,
      message: 'Greetings from Kenya! Love the presentation.',
      date: 'Jun 4, 2026, 2:12 PM',
    },
  ],
};

export function readDB(): DB {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data) as DB;
  } catch {
    return initialData;
  }
}

export function writeDB(data: DB): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
