import Image from 'next/image';

export default function Leaderboard() {
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
          <button type="button" className="p-2 ml-5 bg-(--button-area) rounded-t-2xl w-full">
            Most challenges done
          </button>
          <button type="button" className="p-2  bg-(--button-area) rounded-t-2xl w-full">
            Most populars
          </button>
        </div>
        <ul className="flex justify-center flex-col ml-5 p3 text-black bg-(--button-area) p-3 mb-5 rounded-b-3xl">
          <li className="bg-(--leadboard-first) rounded-full p-2 mb-2">1st</li>
          <li className="bg-(--leadboard-second) rounded-full p-2 mb-2">2nd</li>
          <li className="bg-(--leadboard-third) rounded-full p-2 mb-2">3rd</li>
          <li className="bg-(--leadboard-mix-one) rounded-full p-2 mb-2">4th</li>
          <li className="bg-(--leadboard-mix-two) rounded-full p-2 mb-2">5th</li>
          <li className="bg-(--leadboard-mix-one) rounded-full p-2 mb-2">6th</li>
          <li className="bg-(--leadboard-mix-two) rounded-full p-2 mb-2">7th</li>
          <li className="bg-(--leadboard-mix-one) rounded-full p-2 mb-2">8th</li>
          <li className="bg-(--leadboard-mix-two) rounded-full p-2 mb-2">9th</li>
          <li className="bg-(--leadboard-mix-one) rounded-full p-2 mb-2">10th</li>
          <li className="bg-(--leadboard-me) rounded-full p-2 mb-2">My classment</li>
        </ul>
      </section>
    </div>
  );
}
