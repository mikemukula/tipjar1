import TipPageClient from './TipPageClient';

export default async function TipPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <TipPageClient username={username} />;
}
