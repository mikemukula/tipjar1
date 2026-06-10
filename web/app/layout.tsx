import type { Metadata } from 'next';
import './globals.css';
import PrivyClientProvider from '@/providers/PrivyClientProvider';

export const metadata: Metadata = {
  title: 'G$ Tip Jar',
  description: 'Support your favourite creators with GoodDollar on Celo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrivyClientProvider>{children}</PrivyClientProvider>
      </body>
    </html>
  );
}
