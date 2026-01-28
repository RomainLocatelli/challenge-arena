'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import ChallengeCard from '@/component/ChallengeCard';
import PageBanner from '@/component/PageBanner';
import LoginRegisterCard from '@/component/LoginRegisterCard';

export default function Home() {
  type Game = { id: string; title: string; imageUrl: string; slug: string };
  type Challenge = {
    createdAt: string;
    createdBy: string;
    description: string;
    game: {
      id: string;
      title: string;
      slug: string;
      imageUrl: string;
    };
    gameId: string;
    id: string;
    scoreFormat: string;
    title: string;
    slug: string;
    updatedAt: string;
    voteCount: number;
  };

  const { user } = useAuth();

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

  function extractShortDescription(raw: string) {
    const text = (raw ?? '').replace(/\r\n/g, '\n').trim();
    const idx = text.search(/\n\s*details\s*:?\s*\n/i);
    if (idx === -1) {
      return text;
    }
    return text.slice(0, idx).trim();
  }

  // Game shown on screen
  function gamesShownOnPage(games: Game[]) {
    return (
      <div className="flex scroll-smooth overflow-x-auto overflow-scroll min-w-40  h-63  lg:snap-none overflow-y-visible pb-5 snap-x ml-3 mr-3 ">
        {games.map((game) => {
          return (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="bg-(--button-area) hover:outline-double  outline-(--button-select) shrink-0 rounded-4xl snap-centertransition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 mt-5 ml-5 mr-5 scroll"
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
      <div className="flex gap-10 scroll-smooth overflow-x-auto overflow-y-hidden snap-x snap-mandatory m-3 mb-5 pb-4 lg:block lg:overflow-y-visible ">
        <div className="grid grid-rows-2 grid-flow-col gap-10 w-max m-5">
          {challenges.map((challenge) => {
            return (
              <ChallengeCard
                key={challenge.id}
                gameTitle={challenge.game?.title ?? ''}
                gameSlug={challenge.game?.slug ?? ''}
                title={challenge.title}
                description={extractShortDescription(challenge.description)}
                voteCount={challenge.voteCount}
                slug={challenge.slug ?? challenge.id}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen light:-bg-(--background-header)">
      {/* GamerChallenge news area */}
      <PageBanner title="Forge your challenge" />
      {!user ? (
        <LoginRegisterCard message="Your next challenge awaits. Join the community" />
      ) : null}
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
