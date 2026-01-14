'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Leaderboard() {
  type Users = { id: number; pseudo: string };
  const users: Users[] = [
    { id: 1, pseudo: 'ShadowNinja77' },
    { id: 2, pseudo: 'ZepHyr_Strike' },
    { id: 3, pseudo: 'LunaGamerX' },
    { id: 4, pseudo: 'DragonSlayer42' },
    { id: 5, pseudo: 'PixelPirate' },
    { id: 6, pseudo: 'NeonPhantom' },
    { id: 7, pseudo: 'AstraStorm' },
    { id: 8, pseudo: 'BlazeTitan' },
    { id: 9, pseudo: 'VoidWalker' },
    { id: 10, pseudo: 'FrostByte' }
  ];

  const newUsers: Users[] = [
    { id: 1, pseudo: 'NebulaRider' },
    { id: 2, pseudo: 'ThunderClap' },
    { id: 3, pseudo: 'MysticFox' },
    { id: 4, pseudo: 'QuantumLeap' },
    { id: 5, pseudo: 'SilentStorm' },
    { id: 6, pseudo: 'IronPhoenix' },
    { id: 7, pseudo: 'CosmicJoker' },
    { id: 8, pseudo: 'FrostNova' },
    { id: 9, pseudo: 'BlazeHawk' },
    { id: 10, pseudo: 'ShadowMage' }
  ];

  const [leaderboardSelected, setLeaderboardSelected] = useState({
    name: 'challenges',
    userArray: users
  });

  function leaderboardMobileShown(userArray: Users[]) {
    return userArray.map((user) => {
      if (user.id === 1) {
        return (
          <li
            key={user.id}
            className="flex justify-between bg-(--leadboard-first) rounded-2xl p-2 mb-2"
          >
            <p>1st</p>
            <p className="mr-5">{user.pseudo}</p>
          </li>
        );
      } else if (user.id === 2) {
        return (
          <li
            key={user.id}
            className="flex justify-between bg-(--leadboard-second) rounded-2xl p-2 mb-2"
          >
            <p>2nd</p>
            <p className="mr-5">{user.pseudo}</p>
          </li>
        );
      } else if (user.id === 3) {
        return (
          <li
            key={user.id}
            className="flex justify-between bg-(--leadboard-third) rounded-2xl p-2 mb-2"
          >
            <p>3rd</p>
            <p className="mr-5">{user.pseudo}</p>
          </li>
        );
      } else if (user.id % 2) {
        return (
          <li
            key={user.id}
            className="flex justify-between bg-(--leadboard-mix-one) rounded-2xl p-2 mb-2"
          >
            <p>{user.id}st</p>
            <p className="mr-5">{user.pseudo}</p>
          </li>
        );
      } else {
        return (
          <li
            key={user.id}
            className="flex justify-between bg-(--leadboard-mix-two) rounded-2xl p-2 mb-2"
          >
            <p>{user.id}st</p>
            <p className="mr-5">{user.pseudo}</p>
          </li>
        );
      }
    });
  }

  return (
    <div className="flex justify-center flex-col">
      <Image
        className="m-5 "
        src="/baniere-leaderboard.png"
        width={500}
        height={500}
        alt="gamerchallenge logo"
      />
      <section className="flex justify-center flex-col">
        <div className="flex justify-center w-full">
          <button
            type="button"
            onClick={() => setLeaderboardSelected({ name: 'challenges', userArray: users })}
            className={`p-2 ml-5 ${leaderboardSelected.name === 'challenges' ? 'bg-(--background-header)' : 'bg-(--button-area)'}  rounded-t-2xl w-full`}
          >
            Most challenges done
          </button>
          <button
            type="button"
            value="popular"
            onClick={() => setLeaderboardSelected({ name: 'popular', userArray: newUsers })}
            className={`p-2  ${leaderboardSelected.name === 'popular' ? 'bg-(--background-header)' : 'bg-(--button-area)'}  rounded-t-2xl w-full`}
          >
            Most populars
          </button>
        </div>
        <ul className="flex justify-center flex-col ml-5 text-black bg-(--button-area) p-3 mb-5 rounded-b-3xl">
          {leaderboardMobileShown(leaderboardSelected.userArray)}
          <li className="flex justify-between  bg-(--leadboard-me) rounded-2xl p-2 mb-2 mt-5">
            <p>My classment</p>
            <p className="mr-5">Stwompy</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
