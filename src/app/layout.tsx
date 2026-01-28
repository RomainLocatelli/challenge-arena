import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/component/header/Header';
import Footer from '@/component/footer/Footer';
import { AuthProvider } from './context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'ChallengeArena',
  description:
    'Discover community-made gaming challenges. Create your own, compete with players worldwide, and vote for the best performances.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  const cookieStore = await cookies();

  try {
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');
    const res = await fetch('http://api:3000/auth/me', {
      headers: {
        Cookie: cookieHeader
      },
      credentials: 'include',
      cache: 'no-store'
    });

    const data = await res.json();
    user = data.user;
  } catch (err) {
    // silent err
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider user={user}>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
