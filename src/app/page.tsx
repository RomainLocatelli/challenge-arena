'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  type Game = { id: string; title: string; image: string };
  const games: Game[] = [
    { id: 'elden-ring', title: 'Elden Ring', image: '/real-rat.png' },
    { id: 'dark-souls', title: 'Dark Souls', image: '/real-rat.png' },
    { id: 'dark-souls-ii', title: 'Dark Souls II', image: '/real-rat.png' },
    { id: 'dark-souls-iii', title: 'Dark Souls III', image: '/real-rat.png' },
    { id: 'bloodborne', title: 'Bloodborne', image: '/real-rat.png' },
    { id: 'super-monkey-ball', title: 'Super Monkey Ball', image: '/real-rat.png' },
    { id: 'mario-bros', title: 'Mario Bros', image: '/real-rat.png' },
    { id: 'totalwar-warhammer', title: 'Totalwar Warhammer', image: '/real-rat.png' }
  ];

  const games2: Game[] = [
    { id: 'bloodborne', title: 'Bloodborne', image: '/real-rat.png' },
    { id: 'super-monkey-ball', title: 'Super Monkey Ball', image: '/real-rat.png' },
    { id: 'mario-bros', title: 'Mario Bros', image: '/real-rat.png' },
    { id: 'totalwar-warhammer', title: 'Totalwar Warhammer', image: '/real-rat.png' }
  ];

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // Trending game left arrow function
  function handlePreviousGame() {
    setCurrentGameIndex((prevIndex) => (prevIndex === 0 ? games2.length - 1 : prevIndex - 1));
  }

  // Trending game right arrow function
  function handleNextGame() {
    setCurrentGameIndex((prevIndex) => (prevIndex === games2.length - 1 ? 0 : prevIndex + 1));
  }

  // Trending challenge left arrow function
  function handlePreviousChallenge() {
    setCurrentChallengeIndex((prevIndex) => (prevIndex === 0 ? games.length - 2 : prevIndex - 2));
  }

  // Trending challenge right arrow function
  function handleNextChallenge() {
    setCurrentChallengeIndex((prevIndex) => (prevIndex === games.length - 2 ? 0 : prevIndex + 2));
  }

  // Game shown on screen
  function gamesShownOnPage(games: Game[], index: number) {
    const game = games[index];

    return (
      <div>
        <Link
          key={game.id}
          href={`/games/${game.id}`}
          className="bg-(--button-area) rounded-t-full lg:hidden"
        >
          <Image src={game.image} width={160} height={160} alt={`${game.title} logo`} />
          <h3 className="text-center lg:hidden">{game.title}</h3>
        </Link>
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-10 lg:grid-rows-1">
          {games.map((game) => {
            return (
              <Link key={game.id} href={`/games/${game.id}`} className="bg-(--button-area)">
                <Image src={game.image} width={160} height={160} alt="gamerchallenge logo"></Image>
                <h3 className="text-center">{game.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Challenges shown on screen
  function challengesShownOnPage(games: Game[], index: number) {
    const challenge = games[index];
    const challenge2 = games[index + 1];

    return (
      <div className="flex flex-col gap-4 m-3 mb-5">
        <div className="lg:hidden">
          <Link key={challenge.id} href={`/games/${challenge.id}`} className="bg-(--button-area)">
            <Image src={challenge.image} width={160} height={160} alt="gamerchallenge logo"></Image>
            <h3 className="text-center">{challenge.title}</h3>
          </Link>
          <Link key={challenge2.id} href={`/games/${challenge2.id}`} className="bg-(--button-area)">
            <Image
              src={challenge2.image}
              width={160}
              height={160}
              alt="gamerchallenge logo"
            ></Image>
            <h3 className="text-center">{challenge2.title}</h3>
          </Link>
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-10">
          {games.map((game) => {
            return (
              <Link key={game.id} href={`/games/${game.id}`} className="bg-(--button-area)">
                <Image src={game.image} width={160} height={160} alt="gamerchallenge logo"></Image>
                <h3 className="text-center">{game.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* GamerChallenge news area */}
      <div className="bg-[url(/baniere-leaderboard.png)] bg-no-repeat bg-cover h-50 text-center">
        <p>This is where the news come in</p>
      </div>
      <nav className="flex justify-center mb-8">
        <Link href="/login-register/login">
          <button type="button" className="bg-(--button-area) p-3 rounded-3xl mr-8 mt-6">
            Login
          </button>
        </Link>
        <Link href="/login-register/register">
          <button type="button" className="bg-(--button-select) p-3 rounded-3xl  mt-6">
            Register
          </button>
        </Link>
      </nav>
      <div className="">
        <nav className="flex justify-between align-content m-5 items-center-safe">
          <p className="text-center text-xl">
            <strong>Trending games</strong>
          </p>
          <Link href="/games">
            <button className="bg-(--button-area) p-2 pr-3 pl-3 rounded-3xl">View all</button>
          </Link>
        </nav>
        <div>
          <button></button>

          <button></button>
        </div>
      </div>
      {/* show trending games */}
      <section className="flex justify-between mr-5 ml-5 mb-10 lg:justify-center">
        <button type="button" onClick={handlePreviousGame} className="lg:hidden">
          <Image
            src="/arrow-left.png"
            width={40}
            height={40}
            alt="change game trending left"
            className="bg-(--button-area) rounded-3xl p-2 hover:bg-(--button-select)"
          ></Image>
        </button>
        {gamesShownOnPage(games2, currentGameIndex)}
        <button type="button" onClick={handleNextGame} className="lg:hidden">
          <Image
            src="/arrow-right.png"
            width={40}
            height={40}
            alt="change game trending right"
            className="bg-(--button-area) rounded-3xl p-2 hover:bg-(--button-select)"
          ></Image>
        </button>
      </section>

      {/* show trending challenges */}
      <section>
        <nav className="flex justify-between align-content m-5 items-center-safe lg:h-10 lg:flex-wrap">
          <p className="text-center text-xl">
            <strong>Trending challenges</strong>
          </p>
          <Link href="/games">
            <button className="bg-(--button-area) p-2 pr-3 pl-3 rounded-3xl">View all</button>
          </Link>
        </nav>
        <nav className="flex justify-between mr-5 ml-5 lg:justify-center">
          <button type="button" onClick={handlePreviousChallenge} className="lg:hidden">
            <Image
              src="/arrow-left.png"
              width={40}
              height={40}
              alt="change game trending left"
              className="bg-(--button-area) rounded-3xl p-2 hover:bg-(--button-select)"
            ></Image>
          </button>
          {challengesShownOnPage(games, currentChallengeIndex)}
          <button type="button" onClick={handleNextChallenge} className="lg:hidden">
            <Image
              src="/arrow-right.png"
              width={40}
              height={40}
              alt="change game trending right"
              className="bg-(--button-area) rounded-3xl p-2 hover:bg-(--button-select)"
            ></Image>
          </button>
        </nav>
      </section>
    </div>
  );
}
