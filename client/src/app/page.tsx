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
    { id: 'super-monkey-ball', title: 'Super Monkey Ball', image: '/real-rat.png' }
  ];

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // Trending game left arrow function
  function handlePreviousGame() {
    setCurrentGameIndex((prevIndex) => (prevIndex === 0 ? games.length - 1 : prevIndex - 1));
  }

  // Trending game right arrow function
  function handleNextGame() {
    setCurrentGameIndex((prevIndex) => (prevIndex === games.length - 1 ? 0 : prevIndex + 1));
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
      <Link key={game.id} href={`/games/${game.id}`} className="bg-(--button-area) rounded-t-full">
        <div>
          <Image src={game.image} width={160} height={160} alt={`${game.title} logo`} />
        </div>
        <h3 className="text-center">{game.title}</h3>
      </Link>
    );
  }

  // Game shown on screen
  function challengesShownOnPage(games: Game[], index: number) {
    const challenge = games[index];
    const challenge2 = games[index + 1];

    return (
      <div className="flex flex-col gap-4 m-3 mb-5">
        <Link key={challenge.id} href={`/games/${challenge.id}`} className="bg-(--button-area)">
          <div className="">
            <Image src={challenge.image} width={160} height={160} alt="gamerchallenge logo"></Image>
          </div>
          <div className="">
            <h3 className="">{challenge.title}</h3>
          </div>
        </Link>
        <Link key={challenge2.id} href={`/games/${challenge2.id}`} className="bg-(--button-area)">
          <div className="">
            <Image
              src={challenge2.image}
              width={160}
              height={160}
              alt="gamerchallenge logo"
            ></Image>
          </div>
          <div className="">
            <h3 className="">{challenge2.title}</h3>
          </div>
        </Link>
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
      <section className="flex justify-between mr-5 ml-5 mb-10">
        <button type="button" onClick={handlePreviousGame}>
          <Image
            src="/arrow-left.png"
            width={40}
            height={40}
            alt="change game trending left"
            className="bg-(--button-area) rounded-3xl p-2 hover:bg-(--button-select)"
          ></Image>
        </button>
        {gamesShownOnPage(games, currentGameIndex)}
        <button type="button" onClick={handleNextGame}>
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
      <section className="">
        <nav className="flex justify-between align-content m-5 items-center-safe">
          <p className="text-center text-xl">
            <strong>Trending challenges</strong>
          </p>
          <Link href="/games">
            <button className="bg-(--button-area) p-2 pr-3 pl-3 rounded-3xl">View all</button>
          </Link>
        </nav>
        <nav className="flex justify-between mr-5 ml-5">
          <button type="button" onClick={handlePreviousChallenge} className="">
            <Image
              src="/arrow-left.png"
              width={40}
              height={40}
              alt="change game trending left"
              className="bg-(--button-area) rounded-3xl p-2 hover:bg-(--button-select)"
            ></Image>
          </button>
          {challengesShownOnPage(games, currentChallengeIndex)}
          {/* <div className="flex flex-col gap-4 m-3 mb-5">
            <Link key={game.id} href={`/games/${game.id}`} className="bg-(--button-area)">
              <div className="">
                <Image src={game.image} width={160} height={160} alt="gamerchallenge logo"></Image>
              </div>
              <div className="">
                <h3 className="">{game.title}</h3>
              </div>
            </Link>
            <Link key={53} href={`/games/${game.id}`} className="bg-(--button-area)">
              <div className="">
                <Image src={game.image} width={160} height={160} alt="gamerchallenge logo"></Image>
              </div>
              <div className="">
                <h3 className="">{game.title}</h3>
              </div>
            </Link>
          </div> */}
          <button type="button" onClick={handleNextChallenge} className="">
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
