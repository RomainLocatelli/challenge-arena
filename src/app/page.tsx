'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  type Game = { id: string; title: string; imageUrl: string };
  type Challenge = {
    createdAt: string;
    createdBy: string;
    description: string;
    game: {
      id: string;
      title: string;
      imageUrl: string;
      description: string;
    };
    gameId: string;
    id: string;
    scoreFormat: string;
    title: string;
    updatedAt: string;
    voteCount: number;
  };

  const [homePageGames, setHomePageGames] = useState<Game[]>([]);
  const [homePageChallenges, setHomePageChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    async function getHomePage() {
      const registerUrl = process.env.API_URL || '';
      const response = await fetch(registerUrl);
      const replyDb = await response.json();

      setHomePageGames(replyDb.topGames);
      setHomePageChallenges(replyDb.topChallenges);
    }

    getHomePage();
  }, []);

  const formatVotes = (n: number) => {
    return `${n}`;
  };

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // Trending game left arrow function
  function handlePreviousGame() {
    setCurrentGameIndex((prevIndex) =>
      prevIndex === 0 ? homePageGames.length - 1 : prevIndex - 1
    );
  }

  // Trending game right arrow function
  function handleNextGame() {
    setCurrentGameIndex((prevIndex) =>
      prevIndex === homePageGames.length - 1 ? 0 : prevIndex + 1
    );
  }

  // Trending challenge left arrow function
  function handlePreviousChallenge() {
    setCurrentChallengeIndex((prevIndex) =>
      prevIndex === 0 ? homePageChallenges.length - 2 : prevIndex - 2
    );
  }

  // Trending challenge right arrow function
  function handleNextChallenge() {
    setCurrentChallengeIndex((prevIndex) =>
      prevIndex === homePageChallenges.length - 2 ? 0 : prevIndex + 2
    );
  }

  // Game shown on screen
  function gamesShownOnPage(games: Game[], index: number) {
    const game = games[index];

    return (
      <div>
        <div className="bg-(--button-area)  rounded-4xl ">
          <Link key={game.id} href={`/games/${game.id}`} className="lg:hidden">
            <Image
              src={game.imageUrl}
              width={160}
              height={160}
              alt={`${game.title} logo`}
              className="h-40 object-cover rounded-t-4xl"
            />
            <h3 className="text-center mt-2 lg:hidden ">{game.title}</h3>
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-10 h-50 ">
          {games.map((game) => {
            return (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="bg-(--button-area)  rounded-4xl"
              >
                <Image
                  src={game.imageUrl}
                  width={200}
                  height={200}
                  alt="gamerchallenge logo"
                  className="h-40 object-cover rounded-t-4xl"
                ></Image>
                <h3 className="text-center mt-2">{game.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Challenges shown on screen
  function challengesShownOnPage(challenges: Challenge[], index: number) {
    const challenge = challenges[index];
    const challenge2 = challenges[index + 1];

    return (
      <div className="flex flex-col gap-4 m-3 mb-5">
        <div className="lg:hidden">
          <div
            key={challenge.id}
            className="rounded-2xl mb-6 bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
          >
            <div className="p-5 flex flex-col h-full">
              {/* Tag / jeu */}
              <div className="text-xs font-semibold tracking-widest text-purple-300/90 mb-2">
                {(challenge.game.title ?? challenge.title).toUpperCase()}
              </div>

              {/* Titre */}
              <div className="text-2xl font-semibold leading-tight mb-2">{challenge.title}</div>

              {/* Description */}
              <div className="text-white/70 leading-relaxed mb-4">{challenge.description}</div>

              {/* votes + bouton */}
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-white/70">
                  <span className="relative w-8 h-8 shrink-0">
                    {/* <Image
                      src={challenge.hasLiked ? '/like 1.png' : '/like 0.png'}
                      alt={challenge.hasLiked ? 'Liked' : 'Not liked'}
                      fill
                      sizes="32px"
                      className="object-contain"
                    /> */}
                  </span>
                  <span className="text-sm font-semibold">{formatVotes(challenge.voteCount)}</span>
                  <span className="text-sm">likes</span>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
          <div
            key={challenge2.id}
            className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
          >
            <div className="p-5 flex flex-col h-full">
              {/* Tag / jeu */}
              <div className="text-xs font-semibold tracking-widest text-purple-300/90 mb-2">
                {(challenge2.game.title ?? challenge2.title).toUpperCase()}
              </div>

              {/* Titre */}
              <div className="text-2xl font-semibold leading-tight mb-2">{challenge2.title}</div>

              {/* Description */}
              <div className="text-white/70 leading-relaxed mb-4">{challenge2.description}</div>

              {/* votes + bouton */}
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-white/70">
                  <span className="relative w-8 h-8 shrink-0">
                    {/* <Image
                      src={challenge2.hasLiked ? '/like 1.png' : '/like 0.png'}
                      alt={challenge2.hasLiked ? 'Liked' : 'Not liked'}
                      fill
                      sizes="32px"
                      className="object-contain"
                    /> */}
                  </span>
                  <span className="text-sm font-semibold">{formatVotes(challenge2.voteCount)}</span>
                  <span className="text-sm">likes</span>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-10">
          {challenges.map((challenge) => {
            return (
              <div
                key={challenge.id}
                className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* Tag / jeu */}
                  <div className="text-xs font-semibold tracking-widest text-purple-300/90 mb-2">
                    {(challenge.game.title ?? challenge.title).toUpperCase()}
                  </div>

                  {/* Titre */}
                  <div className="text-2xl font-semibold leading-tight mb-2">{challenge.title}</div>

                  {/* Description */}
                  <div className="text-white/70 leading-relaxed mb-4">{challenge.description}</div>

                  {/* votes + bouton */}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-white/70">
                      <span className="relative w-8 h-8 shrink-0">
                        {/* <Image
                      src={challenge.hasLiked ? '/like 1.png' : '/like 0.png'}
                      alt={challenge.hasLiked ? 'Liked' : 'Not liked'}
                      fill
                      sizes="32px"
                      className="object-contain"
                    /> */}
                      </span>
                      <span className="text-sm font-semibold">
                        {formatVotes(challenge.voteCount)}
                      </span>
                      <span className="text-sm">likes</span>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* GamerChallenge news area */}
      <div className="bg-[url(/baniere-leaderboard.png)] bg-no-repeat bg-cover h-50 text-center">
        <p>This is where the news come in</p>
      </div>
      <nav className="flex justify-center mb-8">
        <Link href="/login-register/login">
          <button
            type="button"
            className="bg-(--button-area) p-3 rounded-3xl mr-8 mt-6 cursor-pointer"
          >
            Login
          </button>
        </Link>
        <Link href="/login-register/register">
          <button
            type="button"
            className="bg-(--button-select) p-3 rounded-3xl  mt-6 cursor-pointer"
          >
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
            <button className="bg-(--button-area) p-2 pr-3 pl-3 rounded-3xl cursor-pointer">
              View all
            </button>
          </Link>
        </nav>
        <div>
          <button></button>

          <button></button>
        </div>
      </div>
      {/* show trending games */}
      <section className="flex justify-between mr-5 ml-5 mb-10 lg:justify-center ">
        <button type="button" onClick={handlePreviousGame} className="lg:hidden">
          <Image
            src="/arrow-left.png"
            width={40}
            height={40}
            alt="change game trending left"
            className="bg-(--button-area) rounded-3xl p-2 hover:bg-(--button-select)"
          ></Image>
        </button>
        {homePageGames.length > 0 && gamesShownOnPage(homePageGames, currentGameIndex)}
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
          <Link href="/challenges">
            <button className="bg-(--button-area) p-2 pr-3 pl-3 rounded-3xl cursor-pointer">
              View all
            </button>
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
          {homePageChallenges.length > 0 &&
            challengesShownOnPage(homePageChallenges, currentChallengeIndex)}
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
