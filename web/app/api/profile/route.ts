import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.creator);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDB();
  db.creator = { ...db.creator, ...body };
  writeDB(db);
  return NextResponse.json({ success: true, profile: db.creator });
}
