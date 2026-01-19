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

  // Game shown on screen
  function gamesShownOnPage(games: Game[]) {
    return (
      <div className="flex scroll-smooth overflow-x-auto overflow-scroll min-w-40  h-63  lg:snap-none lg:overflow-y-visible pb-5 snap-x ml-3 mr-3 ">
        {games.map((game) => {
          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="bg-(--button-area) hover:outline-double  outline-(--button-select) shrink-0 rounded-4xl snap-centertransition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 mt-5 ml-5 mr-5"
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
    );
  }

  // Challenges shown on screen
  function challengesShownOnPage(challenges: Challenge[]) {
    return (
      <div className="flex gap-10 scroll-smooth overflow-x-auto overflow-y-hidden snap-x snap-mandatory m-3 mb-5 pb-4 lg:block lg:overflow-y-visible">
        <div className="grid grid-rows-2 grid-flow-col gap-10 w-max m-5">
          {challenges.map((challenge) => {
            return (
              <div
                key={challenge.id}
                className="rounded-2xl shrink-0 snap-center bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] w-60 lg:w-70 hover:outline-double  outline-(--button-select) delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 "
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
                    <div className="items-center gap-2 text-white/70">
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
                      <span className="text-sm"> likes</span>
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
      <div className="bg-[url(/baniere-leaderboard.png)] bg-no-repeat bg-cover h-50 text-center m-5 rounded-4xl">
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
            <button className="bg-(--button-area) hover:bg-(--button-select) p-2 pr-3 pl-3 rounded-3xl cursor-pointer">
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
      <section className="flex justify-between mr-5 ml-5 mb-10  lg:justify-center ">
        {gamesShownOnPage(homePageGames)}
      </section>

      {/* show trending challenges */}
      <section>
        <nav className="flex justify-between align-content m-5 items-center-safe lg:h-10 lg:flex-wrap">
          <p className="text-center text-xl">
            <strong>Trending challenges</strong>
          </p>
          <Link href="/challenges">
            <button className="bg-(--button-area) hover:bg-(--button-select) p-2 pr-3 pl-3 rounded-3xl cursor-pointer">
              View all
            </button>
          </Link>
        </nav>
        <nav className="flex justify-between mr-5 ml-5 lg:justify-center">
          {challengesShownOnPage(homePageChallenges)}
        </nav>
      </section>
    </div>
  );
}
