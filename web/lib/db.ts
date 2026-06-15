import { createServerSupabaseClient } from './supabase';

export interface Creator {
  id?: string;
  username: string;
  wallet_address: string;
  name: string;
  bio: string;
  youtube: string;
  twitter: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Tip {
  id?: string;
  creator_username: string;
  sender_name: string;
  sender_address: string;
  amount: number;
  message: string;
  tx_hash?: string | null;
  created_at?: string;
}

export interface TipAggregate {
  total: number;
  count: number;
}

export async function getCreator(username: string): Promise<Creator | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_creators')
    .select('*')
    .eq('username', username)
    .single();
  if (error) return null;
  return data as Creator;
}

export async function getCreatorByWallet(walletAddress: string): Promise<Creator | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_creators')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  if (error) return null;
  return data as Creator;
}

export async function upsertCreator(creator: Omit<Creator, 'id' | 'created_at'>): Promise<Creator | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_creators')
    .upsert(
      { ...creator, updated_at: new Date().toISOString() },
      { onConflict: 'wallet_address' }
    )
    .select()
    .single();
  if (error) {
    console.error('upsertCreator error:', error);
    return null;
  }
  return data as Creator;
}

export async function getTips(creatorUsername: string): Promise<Tip[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_tips')
    .select('*')
    .eq('creator_username', creatorUsername)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as Tip[];
}

export async function getSentTips(senderAddress: string): Promise<Tip[]> {
  const normalized = senderAddress.toLowerCase();
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_tips')
    .select('*')
    .ilike('sender_address', normalized)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as Tip[];
}

export async function getReceivedTipStats(creatorUsername: string): Promise<TipAggregate> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_tips')
    .select('amount')
    .eq('creator_username', creatorUsername);

  if (error || !data) return { total: 0, count: 0 };

  const total = data.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  return { total, count: data.length };
}

export async function getSentTipStats(senderAddress: string): Promise<TipAggregate> {
  const normalized = senderAddress.toLowerCase();
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_tips')
    .select('amount')
    .ilike('sender_address', normalized);

  if (error || !data) return { total: 0, count: 0 };

  const total = data.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  return { total, count: data.length };
}

export async function addTip(tip: Omit<Tip, 'id' | 'created_at'>): Promise<Tip | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tipjar_tips')
    .insert(tip)
    .select()
    .single();
  if (error) {
    console.error('addTip error:', error);
    return null;
  }
  return data as Tip;
}
