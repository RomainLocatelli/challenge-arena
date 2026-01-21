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
  title: 'GamerChallenge',
  description: 'Challenge yourself'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
      cache: 'no-store'
    });

    const data = await res.json();
    user = data.user;
    console.log(user);
  } catch (err) {
    //  silent
  }

  return (
    <html lang="en" data-theme="ligh">
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
