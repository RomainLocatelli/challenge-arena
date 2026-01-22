'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
      credentials: 'include'
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject('Erreur lors de la récupération du profil')
      )
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        setUser(null);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { user, loading, error };
}

export default function ProfilePage() {
  const { user, loading, error: profileError } = useProfile();
  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const [showAllParticipations, setShowAllParticipations] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Met à jour les champs username/email quand user est chargé
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = () => {
    // Vérifier que les mots de passe correspondent
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Ici tu pourras ajouter la logique pour sauvegarder les modifications
    // Le backend validera le format du mot de passe
    setError('');
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="text-2xl font-bold animate-pulse">Chargement du profil...</div>
      </main>
    );
  }

  if (profileError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
          <p className="text-red-300 text-lg font-semibold">Erreur lors du chargement du profil.</p>
          <p className="text-red-200 text-sm mt-2">{String(profileError)}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Banner - Version ultra minimaliste */}
      <div
        className="relative mx-5 my-8 max-w-5xl lg:mx-auto border-b pb-6"
        style={{ borderColor: 'rgba(237,237,237,0.1)' }}
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 rounded-full" style={{ background: 'var(--button-select)' }} />
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-[var(--foreground)]">{username}</h1>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-5 lg:mx-auto my-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select) shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Challenges</p>
            <p className="text-4xl font-black text-(--button-select)">5</p>
          </div>
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select) shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Participations</p>
            <p className="text-4xl font-black text-(--button-select)">5</p>
          </div>
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select) shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Total Likes</p>
            <p className="text-4xl font-black text-(--button-select)">183</p>
          </div>
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select) shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Global Rank</p>
            <p className="text-4xl font-black text-(--button-select)">#156</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="max-w-5xl mx-5 lg:mx-auto my-8">
        <div className="rounded-2xl bg-(--button-area) ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden p-6">
          <div className="flex justify-between items-start">
            {/* Left side - User Info */}
            <div className="space-y-4">
              <div>
                <span className="text-sm">Username:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mt-1 text-lg font-semibold bg-slate-400 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-lg font-semibold">{username}</p>
                )}
              </div>
              <div>
                <span className="text-sm">Mail:</span>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 text-lg bg-slate-400 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-lg">{email}</p>
                )}
              </div>
              <div>
                <span className="text-sm">Password:</span>
                {isEditing ? (
                  <>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full mt-1 text-lg bg-slate-400 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                    />
                    <p className="text-xs text-red-400 mt-1">
                      Password must be at least 8 characters, contain an uppercase letter and a
                      special character.
                    </p>
                  </>
                ) : (
                  <p className="text-lg">••••••••</p>
                )}
              </div>
              {isEditing && (
                <div>
                  <span className="text-sm">Confirm Password:</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full mt-1 text-lg bg-slate-400 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}
              <div>
                <span className="text-sm">Registered since:</span>
                <p className="text-lg">January 15, 2026</p>
              </div>
            </div>

            {/* Right side - Modify/Save Button */}
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                Modify
              </button>
            )}
          </div>

          {/* Error Message */}
          {isEditing && error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mt-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Challenges and Participations */}
      <div className="max-w-5xl mx-5 lg:mx-auto my-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* My Last Challenges */}
        <div className="rounded-2xl bg-(--button-area) ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden p-6">
          <h2 className="text-2xl font-bold mb-6">My Last Created Challenges</h2>
          <div className="space-y-4">
            {/* Challenge 1 */}
            <div className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
              <div className="p-5 flex flex-col h-full">
                {/* Tag / jeu */}
                <div className="text-xs font-semibold tracking-widest mb-2">ELDEN RING</div>

                {/* Titre */}
                <div className="text-2xl font-semibold leading-tight mb-2">
                  Epic Speedrun Challenge
                </div>

                {/* Description */}
                <div className="leading-relaxed mb-4">Complete the game in under 30 minutes</div>

                {/* votes + date + Details button */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-semibold">15 Likes</p>
                    </div>
                    <span className="text-xs">2 days ago</span>
                  </div>
                  <Link
                    href="/challenges/epic-speedrun-challenge"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Challenge 2 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllChallenges ? 'hidden block' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                {/* Tag / jeu */}
                <div className="text-xs font-semibold tracking-widest mb-2">DARK SOULS III</div>

                {/* Titre */}
                <div className="text-2xl font-semibold leading-tight mb-2">Boss Rush Master</div>

                {/* Description */}
                <div className="leading-relaxed mb-4">Defeat all bosses without dying</div>

                {/* votes + date + Details button */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-semibold">8 Likes</p>
                    </div>
                    <span className="text-xs">5 days ago</span>
                  </div>
                  <Link
                    href="/challenges/boss-rush-master"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Challenge 3 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllChallenges ? 'hidden' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="text-xs font-semibold tracking-widest mb-2">HOLLOW KNIGHT</div>
                <div className="text-2xl font-semibold leading-tight mb-2">Ultimate Collector</div>
                <div className="leading-relaxed mb-4">Collect all items in one playthrough</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-semibold">23 Likes</p>
                    </div>
                    <span className="text-xs">1 week ago</span>
                  </div>
                  <Link
                    href="/challenges/ultimate-collector"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Challenge 4 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllChallenges ? 'hidden' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="text-xs font-semibold tracking-widest mb-2">BLOODBORNE</div>
                <div className="text-2xl font-semibold leading-tight mb-2">No Hit Run</div>
                <div className="leading-relaxed mb-4">Complete without taking damage</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-semibold">42 Likes</p>
                    </div>
                    <span className="text-xs">2 weeks ago</span>
                  </div>
                  <Link
                    href="/challenges/no-hit-run"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Challenge 5 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllChallenges ? 'hidden' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="text-xs font-semibold tracking-widest mb-2">SEKIRO</div>
                <div className="text-2xl font-semibold leading-tight mb-2">Bell Demon Marathon</div>
                <div className="leading-relaxed mb-4">All bosses with bell demon active</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-semibold">67 Likes</p>
                    </div>
                    <span className="text-xs">3 weeks ago</span>
                  </div>
                  <Link
                    href="/challenges/bell-demon"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button for Challenges */}
          <button
            onClick={() => setShowAllChallenges(!showAllChallenges)}
            className=" mt-4 w-full bg-purple-600 hover:bg-purple-700 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {showAllChallenges ? 'Show Less' : 'View All'}
          </button>
        </div>

        {/* My Last Participations */}
        <div className="rounded-2xl bg-(--button-area) ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden p-6">
          <h2 className="text-2xl font-bold mb-6">My Last Participations</h2>
          <div className="space-y-4">
            {/* Participation 1 */}

            <div className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
              <div className="p-5 flex flex-col h-full">
                {/* Tag / jeu */}
                <div className="text-xs font-semibold tracking-widest mb-2">
                  ZELDA: BREATH OF THE WILD
                </div>

                {/* Titre */}
                <div className="text-2xl font-semibold leading-tight mb-2">No Death Run</div>

                {/* Description */}
                <div className="leading-relaxed mb-4">Video submission for challenge</div>

                {/* likes + date + Participate button */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">8 Likes</span>
                    </div>
                    <span className="text-xs">1 day ago</span>
                  </div>
                  <Link
                    href="/challenges/no-death-run?participationId=p1"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Participation 2 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllParticipations ? 'hidden block' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                {/* Tag / jeu */}
                <div className="text-xs font-semibold tracking-widest mb-2">CELESTE</div>

                {/* Titre */}
                <div className="text-2xl font-semibold leading-tight mb-2">
                  Precision Platforming
                </div>

                {/* Description */}
                <div className="leading-relaxed mb-4">Screenshot proof submitted</div>

                {/* likes + date + Details button */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">2 Likes</span>
                    </div>
                    <span className="text-xs">3 days ago</span>
                  </div>
                  <Link
                    href="/challenges/precision-platforming?participationId=p2"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Participation 3 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllParticipations ? 'hidden' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="text-xs font-semibold tracking-widest mb-2">SEKIRO</div>
                <div className="text-2xl font-semibold leading-tight mb-2">
                  World Record Attempt
                </div>
                <div className="leading-relaxed mb-4">Full run recorded</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">4 Likes</span>
                    </div>
                    <span className="text-xs">1 week ago</span>
                  </div>
                  <Link
                    href="/challenges/world-record-attempt?participationId=p3"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Participation 4 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllParticipations ? 'hidden' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="text-xs font-semibold tracking-widest mb-2">CUPHEAD</div>
                <div className="text-2xl font-semibold leading-tight mb-2">Perfect S-Rank</div>
                <div className="leading-relaxed mb-4">All bosses cleared with S-rank</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">12 Likes</span>
                    </div>
                    <span className="text-xs">2 weeks ago</span>
                  </div>
                  <Link
                    href="/challenges/cuphead-s-rank?participationId=p4"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Participation 5 */}
            <div
              className={`rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden ${!showAllParticipations ? 'hidden' : ''}`}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="text-xs font-semibold tracking-widest mb-2">HADES</div>
                <div className="text-2xl font-semibold leading-tight mb-2">32 Heat Victory</div>
                <div className="leading-relaxed mb-4">Cleared with max heat level</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">31 Likes</span>
                    </div>
                    <span className="text-xs">3 weeks ago</span>
                  </div>
                  <Link
                    href="/challenges/hades-32-heat?participationId=p5"
                    className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button for Participations */}
          <button
            onClick={() => setShowAllParticipations(!showAllParticipations)}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {showAllParticipations ? 'Show Less' : 'View All'}
          </button>
        </div>
      </div>
    </main>
  );
}
