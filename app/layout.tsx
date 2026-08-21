import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'DreamTeam27 - Track your team',
  description: 'One team for the Season',
  // Icon set explicitly here (rather than via the app/icon.svg file
  // convention) because that convention's special route does not survive
  // `output: 'export'` static export -- the <link> tag is present in the
  // server-rendered HTML at build time but the icon route itself is not
  // copied into the exported `out/` output, so the live site ends up with
  // no icon link at all. Pointing at a plain file under `public/` instead
  // is reliable under static export, the same as any other static asset.
  icons: {
    icon: '/images/football27icon.svg',
  },
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
