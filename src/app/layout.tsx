import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WordbitX CRM',
  description:
    'WordbitX CRM workspace for sales pipeline, account management, billing, call intelligence, and team operations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-200 selection:text-blue-950">
        {children}
      </body>
    </html>
  );
}
