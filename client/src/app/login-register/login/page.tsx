'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginData = {
  email: string;
  password: string;
};

export default function AuthLogin() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // IMPORTANT : empêche le rechargement de la page
    setErrorMessage('');
    setIsLoading(true);

    const loginData: LoginData = {
      email: userEmail,
      password: userPassword
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Gérer les erreurs du backend
        setErrorMessage(data.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Login réussi : stocker le token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Rediriger vers la page d'accueil (ou dashboard)
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again later.');
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header stylé */}
      <div className="relative min-h-[35vh] flex items-center justify-center overflow-hidden">
        {/* Glow effect */}

        {/* Contenu */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r ">Log In</h1>
          <p className="text-lg text-white/70">Your next challenge is waiting</p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 pb-20">
        <div className="space-y-4">
          {/* Email */}
          <div className="flex flex-col p-4 bg-slate-800/50 rounded-2xl border border-slate-700 focus-within:border-purple-600 transition">
            <label htmlFor="email" className="text-sm text-white/60 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={userEmail}
              placeholder="your@email.com"
              onChange={(e) => setUserEmail(e.target.value)}
              id="email"
              required
              className="bg-transparent text-white outline-none placeholder:text-white/40"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col p-4 bg-slate-800/50 rounded-2xl border border-slate-700 focus-within:border-purple-600 transition">
            <label htmlFor="password" className="text-sm text-white/60 mb-1">
              Password
            </label>
            <input
              type="password"
              value={userPassword}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
              className="bg-transparent text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 p-4 rounded-2xl font-semibold transition"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </main>
  );
}
