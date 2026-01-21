'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  fetchAllUsers,
  banUser,
  unbanUser,
  fetchReportedChallenges,
  fetchReportedParticipations,
  approveContent,
  deleteReportedChallenge,
  deleteReportedParticipation,
  type User,
  type ReportedChallenge,
  type ReportedParticipation
} from '@/lib/api';

type Tab = 'users' | 'challenges' | 'participations';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('users');
  
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  
  const [challenges, setChallenges] = useState<ReportedChallenge[]>([]);
  
  const [participations, setParticipations] = useState<ReportedParticipation[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {return};
    
    if (!user) {
      router.push('/login-register/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      try {
        setUsersLoading(true);
        
        // Charger users
        const usersData = await fetchAllUsers();
        setUsers(usersData);
        
        // Charger challenges et participations en parallèle (juste pour les compter)
        const [challengesData, participationsData] = await Promise.all([
          fetchReportedChallenges(),
          fetchReportedParticipations()
        ]);
        
        setChallenges(challengesData);
        setParticipations(participationsData);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setUsersLoading(false);
      }
    }

    if (user?.role === 'ADMIN') {
      loadData();
    }
  }, [user]);

  const handleBan = async (userId: string) => {
    if (!confirm('Ban this user?')) {return};

    try {
      setActionLoading(userId);
      await banUser(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isBanned: true, bannedAt: new Date().toISOString() } : u
        )
      );
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      setActionLoading(userId);
      await unbanUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: false, bannedAt: null } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveChallenge = async (challengeId: string) => {
    try {
      setActionLoading(challengeId);
      await approveContent('CHALLENGE', challengeId);
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Delete this challenge? (cascade)')) {return};

    try {
      setActionLoading(challengeId);
      await deleteReportedChallenge(challengeId);
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveParticipation = async (participationId: string) => {
    try {
      setActionLoading(participationId);
      await approveContent('PARTICIPATION', participationId);
      setParticipations((prev) => prev.filter((p) => p.id !== participationId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteParticipation = async (participationId: string) => {
    if (!confirm('Delete this participation? (cascade)')) {return};

    try {
      setActionLoading(participationId);
      await deleteReportedParticipation(participationId);
      setParticipations((prev) => prev.filter((p) => p.id !== participationId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const getUserDisplayName = (u: User) => {
    if (u.isDeleted) {return 'Deleted user'};
    if (u.isBanned) {return 'Banned user'};
    return u.username;
  };

  if (authLoading || !user || user.role !== 'ADMIN') {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Error : {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 border-l-4 border-purple-600 pl-3">
          Moderation
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-white/70 hover:bg-slate-700'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'challenges'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-white/70 hover:bg-slate-700'
            }`}
          >
            Reported Challenges ({challenges.length})
          </button>
          <button
            onClick={() => setActiveTab('participations')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'participations'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-white/70 hover:bg-slate-700'
            }`}
          >
            Reported Participations ({participations.length})
          </button>
        </div>

        <div className="bg-slate-900/70 rounded-2xl ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
          {activeTab === 'users' && (
            <UsersTab
              users={users}
              loading={usersLoading}
              actionLoading={actionLoading}
              onBan={handleBan}
              onUnban={handleUnban}
              getUserDisplayName={getUserDisplayName}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengesTab
              challenges={challenges}
              loading={usersLoading}
              actionLoading={actionLoading}
              onApprove={handleApproveChallenge}
              onDelete={handleDeleteChallenge}
            />
          )}

          {activeTab === 'participations' && (
            <ParticipationsTab
              participations={participations}
              loading={usersLoading}
              actionLoading={actionLoading}
              onApprove={handleApproveParticipation}
              onDelete={handleDeleteParticipation}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function UsersTab({
  users,
  loading,
  actionLoading,
  onBan,
  onUnban,
  getUserDisplayName
}: {
  users: User[];
  loading: boolean;
  actionLoading: string | null;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  getUserDisplayName: (u: User) => string;
}) {
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Challenges</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Participations</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-slate-800/50">
              <td className="px-4 py-3">
                <span className={u.isDeleted || u.isBanned ? 'text-red-400' : ''}>
                  {getUserDisplayName(u)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-white/70">{u.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    u.role === 'ADMIN'
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'bg-slate-700/50 text-white/70'
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3">
                {u.isBanned ? (
                  <span className="text-red-400 text-sm">Banned</span>
                ) : u.isDeleted ? (
                  <span className="text-gray-500 text-sm">Deleted</span>
                ) : (
                  <span className="text-green-400 text-sm">Active</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-white/70">{u._count.createdChallenges}</td>
              <td className="px-4 py-3 text-sm text-white/70">{u._count.participations}</td>
              <td className="px-4 py-3">
                {u.role !== 'ADMIN' && (
                  <>
                    {u.isBanned ? (
                      <button
                        onClick={() => onUnban(u.id)}
                        disabled={actionLoading === u.id}
                        className="px-3 py-1 rounded-lg bg-green-600/80 hover:bg-green-600 text-xs font-semibold disabled:opacity-50"
                      >
                        {actionLoading === u.id ? '...' : 'Unban'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onBan(u.id)}
                        disabled={actionLoading === u.id || u.isDeleted}
                        className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-semibold disabled:opacity-50"
                      >
                        {actionLoading === u.id ? '...' : 'Ban'}
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChallengesTab({
  challenges,
  loading,
  actionLoading,
  onApprove,
  onDelete
}: {
  challenges: ReportedChallenge[];
  loading: boolean;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (challenges.length === 0) {
    return <div className="p-6 text-center text-white/70">No reported challenges</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {challenges.map((c) => (
        <div key={c.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm">
                <span className="text-white font-semibold">Creator : </span>{' '}
                <span className="text-white/70">{c.creator.username}</span>
              </p>
              <p className="text-sm">
                <span className="text-white font-semibold">Title : </span>{' '}
                <span className="text-white/70">{c.title}</span>
              </p>
              <p className="text-sm">
                <span className="text-white font-semibold">Description : </span>{' '}
                <span className="text-white/70">{c.description}</span>
              </p>
              <p className="text-sm">
                <span className="text-white font-semibold">Game : </span>{' '}
                <span className="text-white/70">{c.game.title}</span>
              </p>
              <p className="text-sm">
                <span className="text-white font-semibold">Participations : </span>{' '}
                <span className="text-white/70">{c._count.participations}</span>
              </p>
              <p className="text-sm">
                <span className="text-white font-semibold">Votes : </span>{' '}
                <span className="text-white/70">{c._count.votes}</span>
              </p>
            </div>
            <span className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-xs font-semibold">
              {c.reportCount} report{c.reportCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="mb-3 space-y-2">
            <p className="text-sm font-semibold">Reports :</p>
            {c.reports.slice(0, 3).map((r) => (
              <div key={r.id} className="text-sm text-white/70 pl-4">
                {r.reason} (by {r.user.username})
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(c.id)}
              disabled={actionLoading === c.id}
              className="px-3 py-1 rounded-lg bg-green-600/80 hover:bg-green-600 text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === c.id ? '...' : 'Approve'}
            </button>
            <button
              onClick={() => onDelete(c.id)}
              disabled={actionLoading === c.id}
              className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === c.id ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ParticipationsTab({
  participations,
  loading,
  actionLoading,
  onApprove,
  onDelete
}: {
  participations: ReportedParticipation[];
  loading: boolean;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (participations.length === 0) {
    return <div className="p-6 text-center text-white/70">No reported participations</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {participations.map((p) => (
        <div key={p.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm">
                <span className="text-white font-semibold">Author :</span>{' '}
                <span className="text-white/70">{p.user.username}</span>
              </p>
              <p className="text-sm">
                <span className="text-white font-semibold">Challenge :</span>{' '}
                <span className="text-white/70">{p.challenge.title}</span>
              </p>
              {p.description && (
                <p className="text-sm">
                  <span className="text-white font-semibold">Description :</span>{' '}
                  <span className="text-white/70">{p.description}</span>
                </p>
              )}
              <a
                href={p.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:underline"
              >
                View submission
              </a>
              <p className="text-sm">
                <span className="text-white font-semibold">Votes :</span>{' '}
                <span className="text-white/70">{p._count.votes}</span>
              </p>
            </div>
            <span className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-xs font-semibold">
              {p.reportCount} report{p.reportCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="mb-3 space-y-2">
            <p className="text-sm font-semibold">Reports :</p>
            {p.reports.slice(0, 3).map((r) => (
              <div key={r.id} className="text-sm text-white/70 pl-4">
                {r.reason} (by {r.user.username})
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(p.id)}
              disabled={actionLoading === p.id}
              className="px-3 py-1 rounded-lg bg-green-600/80 hover:bg-green-600 text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === p.id ? '...' : 'Approve'}
            </button>
            <button
              onClick={() => onDelete(p.id)}
              disabled={actionLoading === p.id}
              className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === p.id ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}