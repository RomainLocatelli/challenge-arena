import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const game = { id: 'elden-ring', title: 'Elden Ring', image: '/real-rat.png' };

  return (
    <div>
      {/* GamerChallenge news area */}
      <div></div>
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
      <section className="flex">
        <button type="button" className="">
          <Image
            src="/arrow-left.png"
            width={160}
            height={160}
            alt="change game trending left"
          ></Image>
        </button>
        <Link key={game.id} href={`/games/${game.id}`} className="">
          <div className="">
            <Image src={game.image} width={160} height={160} alt="gamerchallenge logo"></Image>
          </div>
          <div className="">
            <h3 className="">{game.title}</h3>
          </div>
        </Link>
        <button type="button" className="">
          <Image
            src="/arrow-right.png"
            width={160}
            height={160}
            alt="change game trending right"
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
        <nav className="flex">
          <button type="button" className="">
            <Image
              src="/arrow-left.png"
              width={160}
              height={160}
              alt="change game trending left"
            ></Image>
          </button>
          <div className="flex flex-col">
            <Link key={game.id} href={`/games/${game.id}`} className="">
              <div className="">
                <Image src={game.image} width={160} height={160} alt="gamerchallenge logo"></Image>
              </div>
              <div className="">
                <h3 className="">{game.title}</h3>
              </div>
            </Link>
            <Link key={53} href={`/games/${game.id}`} className="">
              <div className="">
                <Image src={game.image} width={160} height={160} alt="gamerchallenge logo"></Image>
              </div>
              <div className="">
                <h3 className="">{game.title}</h3>
              </div>
            </Link>
          </div>
          <button type="button" className="">
            <Image
              src="/arrow-right.png"
              width={160}
              height={160}
              alt="change game trending right"
            ></Image>
          </button>
        </nav>
      </section>
    </div>
  );
}
