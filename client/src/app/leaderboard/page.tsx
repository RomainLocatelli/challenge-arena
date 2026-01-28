'use client';

import { Fragment, useEffect, useState } from 'react';
import PodiumStars from './component/starry-background';
import { useAuth } from '../context/AuthContext';
import PageBanner from '@/component/PageBanner';
import { LeaderboardResponse } from '@/lib/Types';

// Type pour normaliser les données de leaderboard
type LeaderboardUser = {
  username: string;
  score: number;
  rank?: number;
};

export default function Leaderboard() {
  const { user } = useAuth();
  const currentUsername = user?.username;

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<'likes' | 'participation'>(
    'likes'
  );

  useEffect(() => {
    async function getLeaderboard() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/leaderboard`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }

        const data: LeaderboardResponse = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    getLeaderboard();
  }, []);

  // Normalize the leaderboard format to a unique one
  function normalizeLeaderboardData(leaderboardType: 'likes' | 'participation'): LeaderboardUser[] {
    if (!leaderboardData) {
      return [];
    }

    if (leaderboardType === 'likes') {
      return leaderboardData.topByLikes.map((user) => ({
        username: user.username,
        score: user.totalLikes
      }));
    } else {
      return leaderboardData.topByParticipations.map((user) => ({
        username: user.username,
        score: user.participationCount
      }));
    }
  }

  // Add suffix to rank
  function getOrdinalSuffix(num: number) {
    if (num > 3 && num < 21) {
      return 'th';
    }
    switch (num % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  // Sort and add rank to users
  function getSortedArrayWithRanks(
    userArray: LeaderboardUser[]
  ): (LeaderboardUser & { rank: number })[] {
    // Delete if the connected user is a part of the top 10 leaderboard
    const uniqueUsers = userArray.filter(
      (user, index, self) => index === self.findIndex((u) => u.username === user.username)
    );

    // Sort all users
    const sorted = uniqueUsers.sort((a, b) => b.score - a.score);

    // Add rank to users
    return sorted.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }

  // To create the coloring for the leaderboard
  function getBgClass(rank: number, isCurrentUser: boolean): string {
    if (isCurrentUser) {
      if (rank === 1) {
        return 'bg-(--leadboard-first) mb-5 p-4 bg-linear-to-r from-(--leadboard-first) via-(--leadboard-third) to-(--leadboard-first) animate-rainbow drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] bg-size-[200%_200%]';
      }
      if (rank === 2) {
        return 'bg-(--leadboard-second)';
      }
      if (rank === 3) {
        return 'bg-(--leadboard-third)';
      }
      return 'bg-(--leadboard-me)';
    }
    if (rank === 1) {
      return 'bg-(--leadboard-first) mb-5 p-4 bg-linear-to-r from-(--leadboard-first) via-(--leadboard-third) to-(--leadboard-first) animate-rainbow drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] bg-size-[200%_200%]';
    }

    if (rank === 2) {
      return 'bg-(--leadboard-second) mb-3 p-3';
    }
    if (rank === 3) {
      return 'bg-(--leadboard-third) mb-2.5 p-2.5';
    }
    return rank % 2 ? 'bg-(--leadboard-mix-one)' : 'bg-(--leadboard-mix-two)';
  }

  // To show the users on the leaderboard
  function renderUserItem(user: LeaderboardUser & { rank: number }, isCurrentUser = false) {
    const { rank, username, score } = user;
    const bgClass = getBgClass(rank, isCurrentUser);
    const rankText = `${rank}${getOrdinalSuffix(rank)}`;
    const isPodium = rank <= 3 && !isCurrentUser;
    const isFirst = rank === 1 && !isCurrentUser;

    return (
      <Fragment key={`${username}-${rank}`}>
        <li className={`${isCurrentUser ? 'block mt-5 mb-1' : 'hidden'}`}>
          <p>Your rank :</p>
        </li>
        <li
          className={`flex justify-between ${bgClass} rounded-2xl p-2 mb-2 ${isCurrentUser ? 'mb-3' : ''} relative overflow-hidden`}
        >
          {/* Starry effect for the three first place*/}
          {isPodium && <PodiumStars />}

          <div className="flex relative z-10">
            <p className={`ml-2 content-center ${isFirst ? `text-5xl ` : ''}`}>{rankText}</p>
            <p className={`ml-5 font-bold content-center ${isFirst ? `text-5xl ` : ''}`}>
              {username}
            </p>
          </div>
          <p className={`mr-5 relative z-10 content-center ${isFirst ? `text-5xl ` : ''}`}>
            {score}
          </p>
        </li>
      </Fragment>
    );
  }

  // Render the leaderboard
  function renderLeaderboard(
    userArray: LeaderboardUser[],
    leaderboardType: 'likes' | 'participation'
  ) {
    const sortedUsers = getSortedArrayWithRanks(userArray);
    const currentUser = sortedUsers.find((user) => user.username === currentUsername);

    let connectedUserData: (LeaderboardUser & { rank: number }) | null = null;
    if (leaderboardData?.currentUserRank && currentUsername && !currentUser) {
      const userRank = leaderboardData.currentUserRank;

      if (leaderboardType === 'likes') {
        connectedUserData = {
          username: currentUsername,
          score: userRank.totalLikes,
          rank: userRank.byLikes?.rank || 0
        };
      } else {
        connectedUserData = {
          username: currentUsername,
          score: userRank.byParticipations?.participationCount || 0,
          rank: userRank.byParticipations?.rank || 0
        };
      }
    }

    // Function to show an empty place instead of showing deleting it
    function renderEmptySlot(rank: number) {
      const bgClass = getBgClass(rank, false);
      const rankText = `${rank}${getOrdinalSuffix(rank)}`;

      return (
        <li
          key={`empty-${rank}`}
          className={`flex justify-between ${bgClass} rounded-2xl p-2 mb-2 opacity-50`}
        >
          <p>{rankText}</p>
          <div className="flex">
            <p className="mr-5 text-(--leadboard-me) italic">-</p>
            <p className="ml-5 text-(--leadboard-me)">-</p>
          </div>
        </li>
      );
    }

    // Create a 10 slot array, put the actual player from the bdd and keep the empty slot
    const leaderboardSlots = Array.from({ length: 10 }, (_, index) => {
      const rank = index + 1;
      const user = sortedUsers[index];

      if (user) {
        // actual user
        return renderUserItem(user);
      } else {
        // Empty slot
        return renderEmptySlot(rank);
      }
    });

    return (
      <>
        {/* To always have 10 slot even if empty */}
        {leaderboardSlots}

        {/* Connected user always shown on the bottom of the leaderboard */}
        {currentUser && renderUserItem(currentUser, true)}
        {connectedUserData && renderUserItem(connectedUserData, true)}
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No leaderboard data available</p>
      </div>
    );
  }

  // To select which leaderboard to show on mobile
  const currentLeaderboardData = normalizeLeaderboardData(selectedLeaderboard);

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <PageBanner title="LEADERBOARD" />
      <section className="flex justify-center flex-col">
        <div className="flex justify-center mr-5">
          {/* Mobile: selection button*/}
          <button
            type="button"
            onClick={() => setSelectedLeaderboard('likes')}
            className={`lg:hidden p-2 ml-5 ${selectedLeaderboard === 'likes' ? 'bg-(--button-area)' : 'bg-(--background-header)'} rounded-t-2xl w-full`}
          >
            Most liked players
          </button>

          {/* Desktop: fix title "Most liked players" */}
          <div className="lg:w-full lg:text-center lg:mr-15">
            <p className="lg:p-2 lg:ml-5 rounded-t-2xl w-full bg-(--button-area) hidden lg:block">
              Most liked players
            </p>
          </div>

          {/* Mobile: button "Most participation" */}
          <button
            type="button"
            onClick={() => setSelectedLeaderboard('participation')}
            className={`lg:hidden p-2 ${selectedLeaderboard === 'participation' ? 'bg-(--button-area)' : 'bg-(--background-header)'} rounded-t-2xl w-full`}
          >
            Most participation
          </button>

          {/* Desktop: fix title  pour "Most participation" */}
          <div className="lg:w-full lg:text-center lg:mr-5">
            <p className="lg:p-2 lg:ml-5 rounded-t-2xl w-full bg-(--button-area) hidden lg:block">
              Most participation
            </p>
          </div>
        </div>

        <div className="lg:flex">
          {/* Mobile: show selected leaderboard */}
          <ul className="flex justify-center flex-col lg:hidden ml-5 mr-5 bg-(--button-area) p-3 mb-5 rounded-b-3xl">
            {renderLeaderboard(currentLeaderboardData, selectedLeaderboard)}
          </ul>

          {/* Desktop: show all leaderboard */}
          <ul className="hidden lg:flex lg:justify-center lg:w-full lg:flex-col lg:ml-5 lg:mr-0 lg:bg-(--button-area) lg:p-3 lg:mb-5 lg:rounded-b-3xl">
            {renderLeaderboard(normalizeLeaderboardData('likes'), 'likes')}
          </ul>

          <ul className="hidden lg:flex lg:justify-center lg:w-full lg:flex-col lg:mr-5 lg:bg-(--button-area) lg:p-3 lg:mb-5 lg:ml-15 lg:rounded-b-3xl">
            {renderLeaderboard(normalizeLeaderboardData('participation'), 'participation')}
          </ul>
        </div>
      </section>
    </main>
  );
}
