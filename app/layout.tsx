import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'DreamTeam27 - Track your team',
  description: 'One team for the Season',
  // App icon is provided by app/icon.svg (Next.js file convention).
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="neon">
      <body className="bg-dt-bg text-dt-content">
        <Navigation />
        <main className="min-h-screen bg-dt-bg">
          {children}
        </main>
      </body>
    </html>
  );
}