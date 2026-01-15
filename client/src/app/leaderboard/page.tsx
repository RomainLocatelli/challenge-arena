'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Leaderboard() {
  type Users = { id: number; pseudo: string; score: number };
  const users: Users[] = [
    { id: 1, pseudo: 'ShadowNinja77', score: 5 },
    { id: 2, pseudo: 'ZepHyr_Strike', score: 35 },
    { id: 3, pseudo: 'LunaGamerX', score: 10 },
    { id: 4, pseudo: 'DragonSlayer42', score: 877 },
    { id: 5, pseudo: 'PixelPirate', score: 23 },
    { id: 11, pseudo: 'Stwompy', score: 10000 },
    { id: 7, pseudo: 'AstraStorm', score: 654 },
    { id: 8, pseudo: 'BlazeTitan', score: 4 },
    { id: 9, pseudo: 'VoidWalker', score: 98 },
    { id: 10, pseudo: 'FrostByte', score: 0 },
    { id: 11, pseudo: 'Stwompy', score: 10000 }
  ];

  const newUsers: Users[] = [
    { id: 1, pseudo: 'NebulaRider', score: 2313 },
    { id: 2, pseudo: 'ThunderClap', score: 54 },
    { id: 3, pseudo: 'MysticFox', score: 97 },
    { id: 4, pseudo: 'QuantumLeap', score: 69 },
    { id: 5, pseudo: 'SilentStorm', score: 32 },
    { id: 6, pseudo: 'IronPhoenix', score: 654 },
    { id: 7, pseudo: 'CosmicJoker', score: 22 },
    { id: 8, pseudo: 'FrostNova', score: 25 },
    { id: 9, pseudo: 'BlazeHawk', score: 22 },
    { id: 10, pseudo: 'ShadowMage', score: 321 },
    { id: 11, pseudo: 'Stwompy', score: 653 }
  ];

  const currentUserId = 11;

  const [leaderboardSelected, setLeaderboardSelected] = useState({
    name: 'Most challenges done',
    userArray: users
  });

  // Getting leaderboard's numbers ready to use for all leaderboards
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

  // Sorting ranks from data sent by the database
  function getSortedArrayWithRanks(userArray: Users[]) {
    // Delete the id showing more than one times, in case the user is part of the leaderboard
    const uniqueUsers = userArray.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );

    const sorted = uniqueUsers.sort((a, b) => b.score - a.score);

    // Add rank to users
    return sorted.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }

  // getting leaderboard's colours ready to use for all leaderboards
  function renderUserItem(user: Users & { rank: number }, isCurrentUser = false) {
    const { rank, pseudo, score } = user;
    let bgClass = '';

    // For the current user
    if (isCurrentUser) {
      if (rank === 1) {
        bgClass = 'bg-(--leadboard-first)';
      } else if (rank === 2) {
        bgClass = 'bg-(--leadboard-second)';
      } else if (rank === 3) {
        bgClass = 'bg-(--leadboard-third)';
      } else {
        bgClass = 'bg-(--leadboard-me)';
      }
    } else {
      // For other users leaderbord
      if (rank === 1) {
        bgClass = 'bg-(--leadboard-first)';
      } else if (rank === 2) {
        bgClass = 'bg-(--leadboard-second)';
      } else if (rank === 3) {
        bgClass = 'bg-(--leadboard-third)';
      } else if (rank % 2) {
        bgClass = 'bg-(--leadboard-mix-one)';
      } else {
        bgClass = 'bg-(--leadboard-mix-two)';
      }
    }
    const rankText = `${rank}${getOrdinalSuffix(rank)}`;

    return (
      <li
        key={`${user.id}-${isCurrentUser ? 'me' : 'rank'}`}
        className={`flex justify-between ${bgClass} rounded-2xl p-2 mb-2 ${isCurrentUser ? 'mt-5' : ''}`}
      >
        <p>{rankText}</p>
        <div className="flex">
          <p className="mr-5">{pseudo}</p>
          <p className="ml-5">{score}</p>
        </div>
      </li>
    );
  }

  // Sorting result taken from bdd and showing them correctly on the leaderboard
  function leaderboardMobileShown(userArray: Users[]) {
    const sortedUsers = getSortedArrayWithRanks(userArray);
    const top10 = sortedUsers.slice(0, 10);
    const currentUser = sortedUsers.find((user) => user.id === currentUserId);
    return (
      <>
        {/* Top ten leaderboard showing */}
        {top10.map((user) => renderUserItem(user))}

        {currentUser && renderUserItem(currentUser, true)}
      </>
    );
  }

  return (
    <div className="flex justify-center flex-col">
      <Image
        className="m-5 flex self-center h-30 w-90 lg:h-40 lg:w-150"
        src="/baniere-leaderboard.png"
        width={500}
        height={500}
        alt="gamerchallenge logo"
      />
      <section className="flex justify-center flex-col">
        <div className="flex justify-center mr-5">
          <button
            type="button"
            onClick={() =>
              setLeaderboardSelected({ name: 'Most challenges done', userArray: users })
            }
            className={`lg:hidden p-2 ml-5  ${leaderboardSelected.name === 'Most challenges done' ? 'bg-(--button-area)' : 'bg-(--background-header)'}  rounded-t-2xl w-full`}
          >
            Most challenges done
          </button>
          <div className="lg:w-full lg:text-center lg:mr-15">
            <p className="lg:p-2 lg:ml-5 rounded-t-2xl w-full bg-(--button-area) hidden lg:block">
              Most challenges done
            </p>
          </div>
          <button
            type="button"
            value="popular"
            onClick={() => setLeaderboardSelected({ name: 'Most populars', userArray: newUsers })}
            className={`lg:hidden p-2  ${leaderboardSelected.name === 'Most populars' ? 'bg-(--button-area)' : 'bg-(--background-header)'}  rounded-t-2xl w-full`}
          >
            Most populars
          </button>
          <div className="lg:w-full lg:text-center lg:mr-5">
            <p className="lg:p-2 lg:ml-5 rounded-t-2xl w-full bg-(--button-area) hidden lg:block">
              Most populars
            </p>
          </div>
        </div>
        <div className="lg:flex ">
          <ul className="flex justify-center flex-col lg:w-full ml-5 mr-5 lg:mr-0 text-black bg-(--button-area) p-3 mb-5 rounded-b-3xl">
            {leaderboardMobileShown(leaderboardSelected.userArray)}
          </ul>
          <ul className="lg:flex lg:justify-center hidden lg:w-full lg:visible lg:flex-col lg:mr-5 lg:text-black lg:bg-(--button-area) lg:p-3 lg:mb-5 lg:ml-15 lg:rounded-b-3xl">
            {leaderboardMobileShown(newUsers)}
          </ul>
        </div>
      </section>
    </div>
  );
}
