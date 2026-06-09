import { NextRequest, NextResponse } from 'next/server';
import { getTips, addTip } from '@/lib/db';

// GET /api/tips?username=foo
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'username param is required' }, { status: 400 });
  }

  const tips = await getTips(username);
  return NextResponse.json(tips);
}

// POST /api/tips
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { creator_username, sender_name, sender_address, amount, message, tx_hash } = body;

  if (!creator_username || !amount) {
    return NextResponse.json({ error: 'creator_username and amount are required' }, { status: 400 });
  }

  const tip = await addTip({
    creator_username,
    sender_name: sender_name || 'Anonymous Fan',
    sender_address: sender_address || '',
    amount: parseFloat(amount),
    message: message || '',
    tx_hash: tx_hash || null,
  });

  if (!tip) {
    return NextResponse.json({ error: 'Failed to save tip' }, { status: 500 });
  }

  return NextResponse.json({ success: true, tip });
}
