import Link from 'next/link';

export default function AboutPage() {
  const patternSVG = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c39ed' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  const teamMembers = [
    {
      pseudo: 'Shinro',
      funFact: "Pussy's destroyer",
      avatar: '/cute_rat.jpg'
    },
    {
      pseudo: 'Keerodan',
      funFact: 'Full-stack dev by day, Mythic+ enjoyer by night',
      avatar: '/foxpp.png'
    },
    {
      pseudo: 'Stwompy',
      funFact: "It's not you don't like black licorice.You just have bad taste!",
      avatar: '/Stwompy-pfp.JPEG'
    },
    {
      pseudo: 'Medou',
      funFact: 'Keyboard go brrrr 💻',
      avatar: '/loup(2).png'
    }
  ];

  return (
    <main>
      {/* ========== HERO + WHY CHALLENGEARENA FUSIONNÉS ========== */}
      <section className="relative flex items-center justify-center bg-gradient-to-b from-[var(--background)] via-[var(--button-area)] to-[var(--background)] py-40">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("${patternSVG}")` }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#7c39ed] via-[#d4af37] to-[#7c39ed] bg-[length:200%_auto] bg-clip-text text-transparent animate-rainbow">
              ChallengeArena
            </span>
          </h1>

          {/* Sous-titre court */}
          <p className="text-lg md:text-xl text-slate-400 mb-12">Challenge. Progress. Share.</p>

          {/* Titre de section */}
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="bg-gradient-to-r from-[#7c39ed] to-[#d4af37] bg-clip-text text-transparent">
              About us :
            </span>
          </h2>

          {/* Texte explicatif */}
          <div className="space-y-6 text-slate-300 leading-relaxed text-left md:text-center mb-12">
            <p className="text-base md:text-lg">
              ChallengeArena was born as our final training project at O'Clock school. Among several
              options, we chose this one because it truly resonated with us: building a platform
              where gamers can create challenges, share their best plays, and vote for the most
              impressive performances.
            </p>

            <p className="text-base md:text-lg">
              The idea? A community-driven platform, by gamers, for gamers. Whether you're casual or
              competitive, everyone belongs here. Create your own challenges, take on others', and
              let the community decide who deserves the top spot.
            </p>

            <p className="text-base md:text-lg">
              Technically, this project pushed us to our limits and taught us a ton. But most
              importantly, we had a blast building it. We're proud of what we've achieved, and now
              it's your turn to jump in.
            </p>
          </div>

          {/* Double CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/challenges"
              className="px-8 py-4 bg-[var(--button-select)] hover:bg-[var(--button-game-challenge-hover)] rounded-lg font-semibold text-white hover:scale-105 transition-all shadow-lg hover:shadow-xl hover:shadow-[#7c39ed]/50 text-center"
            >
              Explore Challenges
            </Link>
            <a
              href="/login-register/register"
              className="px-8 py-4 bg-transparent border-2 border-[var(--button-select)] hover:bg-[var(--button-select)] rounded-lg font-semibold text-white hover:scale-105 transition-all text-center"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* ========== TEAM SECTION ========== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-[#7c39ed] to-[#d4af37] bg-clip-text text-transparent">
              The Squad
            </span>
          </h2>
          <p className="text-center text-slate-400 mb-12">The dev team behind ChallengeArena</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.pseudo}
                className="group relative bg-[var(--button-area)] rounded-lg p-6 border border-slate-700 hover:border-[#7c39ed] transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-[var(--background)] border-2 border-[#7c39ed] mb-4 overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.pseudo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{member.pseudo}</h3>

                  <p className="text-sm text-slate-400 italic">{member.funFact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
