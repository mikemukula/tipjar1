import TipPageClient from './TipPageClient';

export default function TipPage({ params }: { params: { username: string } }) {
  return <TipPageClient username={params.username} />;
}
