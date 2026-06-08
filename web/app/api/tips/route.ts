import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.tips);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDB();
  const newTip = {
    sender: body.sender || 'Anonymous Fan',
    address:
      body.address ||
      '0x' +
        Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') +
        '...' +
        Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    amount: parseInt(body.amount) || 0,
    message: body.message || 'Supported the creator!',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
  db.tips = [newTip, ...db.tips];
  writeDB(db);
  return NextResponse.json({ success: true, tip: newTip });
}
