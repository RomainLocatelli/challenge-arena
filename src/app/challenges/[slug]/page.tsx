"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// hook responsive
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

type Participation = {
  id: string;
  name: string;
  scoreLabel: string; 
  link?: string;
  hasLiked?: boolean;
  likes: number;
};

type Challenge = {
  id: string;
  slug: string;
  title: string;
  gameTitle: string;
  createdBy: string;
  image?: string;
  gameImage: string;
  descriptionPoints: string[];
  detailsPoints: string[];
  hasLiked?: boolean;
  likes: number;
  participations: Participation[];
};

// Description avec max 100 chars
const clamp100 = (s: string) => {
  const t = (s ?? "").trim();
  if (t.length <= 100) {
    return t;
  }
  return `${t.slice(0, 97)}...`;
};

export default function ChallengeDetailsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const isMd = useMediaQuery("(min-width: 768px)");
  const defaultVisible = isMd ? 4 : 3;

  useEffect(() => {
  setVisibleCount(defaultVisible);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isMd]);

 // TODO: remplacer par un fetch BDD (slug)
const challengeFromDb: Challenge = useMemo(
  () => ({
    id:  "hollow-knight-steel-soul-no-spells",
    slug: slug ?? "hollow-knight-steel-soul-no-spells",
    title: "Steel Soul: No Spells",
    gameTitle: "Hollow Knight",
    createdBy: "NailMaster",
    image: undefined,
    gameImage: "/real-rat.png",
    descriptionPoints: [
      "Vaincre un boss majeur en mode Steel Soul.",
      "Aucun sort autorisé (Vengeful Spirit, Desolate Dive, Howling Wraiths...).",
      "Le run doit être en solo, sans mods.",
    ],
    detailsPoints: [
      "Lancer une nouvelle partie en Steel Soul.",
      "Choisir un boss majeur (Hornet, Soul Master, Mantis Lords, etc.).",
      "Interdiction d’utiliser tout sort pendant le combat.",
      "Les charms sont autorisés (sauf si tu veux ajouter une variante).",
      "Valider avec une preuve vidéo complète du combat.",
    ],
    hasLiked: true,
    likes: 353,
    participations: [
      {
        id: "p1",
        name: "Léo V.",
        scoreLabel: "Boss: Soul Master • Temps: 2:41",
        link: "https://youtube.com/watch?v=hollowknight_run_241",
        hasLiked: false,
        likes: 14,
      },
      {
        id: "p2",
        name: "Mina R.",
        scoreLabel: "Boss: Mantis Lords • Temps: 3:18",
        link: "https://youtube.com/watch?v=mantis_no_spells_318",
        hasLiked: true,
        likes: 25,
      },
      {
        id: "p3",
        name: "Yanis K.",
        scoreLabel: "Boss: Hornet (Greenpath) • Temps: 1:57",
        link: "https://youtube.com/watch?v=hornet_steel_soul_157",
        hasLiked: false,
        likes: 8,
      },
      {
        id: "p4",
        name: "Chloé D.",
        scoreLabel: "Boss: Broken Vessel • Temps: 4:06",
        link: "https://youtube.com/watch?v=brokenvessel_nospells_406",
        hasLiked: false,
        likes: 3,
      },
      {
        id: "p5",
        name: "Samir B.",
        scoreLabel: "Boss: Dung Defender • Temps: 2:12",
        link: "https://youtube.com/watch?v=dungdefender_212",
        hasLiked: true,
        likes: 21,
      },
    ],
  }),
  [slug]
);

  // Like toggle
  const [challengeHasLiked, setChallengeHasLiked] = useState(!!challengeFromDb.hasLiked);
  const [challengeLikes, setChallengeLikes] = useState(challengeFromDb.hasLikedlikes);

  useEffect(() => {
    setChallengeHasLiked(!!challengeFromDb.hasLiked);
    setChallengeLikes(challengeFromDb.likes);
  }, [challengeFromDb.hasLiked, challengeFromDb.likes]);

  // mode édition
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(challengeFromDb.title);
  const [imageUrl, setImageUrl] = useState<string | undefined>(challengeFromDb.image);
  const [descriptionPoints, setDescriptionPoints] = useState<string[]>(
    challengeFromDb.descriptionPoints
  );
  const [detailsPoints, setDetailsPoints] = useState<string[]>(
    challengeFromDb.detailsPoints
  );
  const [participations, setParticipations] = useState<Participation[]>(
    challengeFromDb.participations
  );

  // Nombre de participations visibles
  const [visibleCount, setVisibleCount] = useState(defaultVisible);

  const headerImage = imageUrl?.trim() ? imageUrl : challengeFromDb.gameImage;

  const formatLikes = (n: number) => {
    return `${n}`;
  };

  const removeParticipation = (id: string) => {
    setParticipations((prev) => prev.filter((p) => p.id !== id));
    // TODO BDD: delete participation by id
  };

  const saveEdits = async () => {
    // TODO BDD: update challenge (title, imageUrl, descriptionPoints, detailsPoints)
    setDescriptionPoints((prev) => prev.map(clamp100));
    setIsEditing(false);
  };

  const cancelEdits = () => {
    setTitle(challengeFromDb.title);
    setImageUrl(challengeFromDb.image);
    setDescriptionPoints(challengeFromDb.descriptionPoints);
    setDetailsPoints(challengeFromDb.detailsPoints);
    setIsEditing(false);
  };

    // Gestion des lignes à puces
  const addBullet = (kind: "desc" | "details") => {
    if (kind === "desc") {
      setDescriptionPoints((p) => [...p, ""]);
    } else {
      setDetailsPoints((p) => [...p, ""]);
    }
  };

  const updateBullet = (kind: "desc" | "details", idx: number, val: string) => {
    if (kind === "desc") {
      setDescriptionPoints((p) => p.map((x, i) => (i === idx ? val : x)));
    } else {
      setDetailsPoints((p) => p.map((x, i) => (i === idx ? val : x)));
    }
  };

  const removeBullet = (kind: "desc" | "details", idx: number) => {
    if (kind === "desc") {
      setDescriptionPoints((p) => p.filter((_, i) => i !== idx));
    } else {
      setDetailsPoints((p) => p.filter((_, i) => i !== idx));
    }
  };

  // Participations à afficher
  const displayedParticipations = participations.slice(0, visibleCount);
  const canViewMore = visibleCount < participations.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-[430px] md:max-w-5xl px-4 md:px-8 py-5 md:py-8">

        {/* Card principale */}
        <div className="rounded-3xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
          
          {/* Header image */}
          <div className="relative h-32 md:h-48 lg:h-64 w-full bg-slate-800">
            <Image
              src={headerImage}
              alt={title}
              fill
              sizes="430px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          </div>
        
        {/* Contenu */}
          <div className="p-5 md:p-8">
            
            {/* Title + like */}
            <div className="flex items-start justify-between gap-3">
              {!isEditing ? (
                <h1 className="text-2xl md:text-4xl font-semibold leading-tight">{title}</h1>
              ) : (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-2xl font-semibold focus:outline-none"
                  placeholder="Challenge title"
                />
              )}

              <div className="flex flex-col items-center leading-none">
                <button
                  type="button"
                  onClick={() => {
                    setChallengeHasLiked((prev) => {
                      const next = !prev;
                      setChallengeLikes((likes) => likes + (next ? 1 : -1));
                      return next;
                    });
                  }}
                  className="relative w-10 h-10 shrink-0 hover:opacity-90"
                  aria-pressed={challengeHasLiked}
                  aria-label={challengeHasLiked ? "Unlike challenge" : "Like challenge"}
                >
                  <Image
                    src={challengeHasLiked ? "/like 1.png" : "/like 0.png"}
                    alt={challengeHasLiked ? "Liked" : "Not liked"}
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </button>
                <div className="mt-1 text-xs text-white/70">{formatLikes(challengeLikes)}</div>
              </div>
            </div>

            {/* Meta + Modify */}
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="text-white/80">
                <div className="text-sm">
                  <span className="text-white/60">Game :</span>{" "}
                  <span className="font-semibold">{challengeFromDb.gameTitle}</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/60">Created by</span>{" "}
                  <span className="font-semibold">{challengeFromDb.createdBy}</span>
                </div>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                >
                  Modify
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelEdits}
                    className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdits}
                    className="px-4 py-2 rounded-2xl bg-amber-600/80 hover:bg-amber-600 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Image edit */}
            {isEditing ? (
              <div className="mt-4">
                <div className="text-sm font-semibold text-white/80 mb-2">Image URL</div>
                <input
                  value={imageUrl ?? ""}
                  onChange={(e) => setImageUrl(e.target.value || undefined)}
                  className="w-full bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="https://..."
                />
                <div className="text-xs text-white/50 mt-2">
                  Laisse vide pour afficher l’image du jeu par défaut.
                </div>
              </div>
            ) : null}

            {/* Description */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-purple-600" />
                  <div className="font-semibold">Description :</div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-950/30 ring-1 ring-white/10 p-3">
                {!isEditing ? (
                  <div className="text-white/85">
                    {clamp100(descriptionPoints[0] ?? "")}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <textarea
                      value={descriptionPoints[0] ?? ""}
                      maxLength={100}
                      onChange={(e) => setDescriptionPoints([e.target.value])}
                      className="flex-1 bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none min-h-[44px]"
                      placeholder="Description (max 100 chars)"
                    />
                    <div className="text-xs text-white/50 w-12 text-right pt-2">
                      {(descriptionPoints[0] ?? "").length}/100
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Challenge Details */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-purple-600" />
                  <div className="font-semibold">Challenge Details :</div>
                </div>

                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => addBullet("details")}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    + Add
                  </button>
                ) : null}
              </div>

              <div className="mt-3 rounded-2xl bg-slate-950/30 ring-1 ring-white/10 p-3">
                <ul className="space-y-2">
                  {detailsPoints.map((txt, idx) => (
                    <li key={`det-${idx}`} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-white/70 shrink-0" />
                      {!isEditing ? (
                        <div className="text-white/85">{txt}</div>
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            value={txt}
                            onChange={(e) => updateBullet("details", idx, e.target.value)}
                            className="flex-1 bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet("details", idx)}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 text-sm"
                            aria-label="Remove detail item"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Participate */}
            <div className="mt-6 flex justify-center md:justify-end">
              <button
                type="button"
                className="px-10 py-3 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
                onClick={() => {
                  // TODO: naviguer vers form de participation
                  router.push(`/challenges/${challengeFromDb.slug}/participate`);
                }}
              >
                Participate
              </button>
            </div>
          </div>
        </div>

        {/* Participations list */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedParticipations.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-white/70 text-sm">{p.scoreLabel}</div>
                  {p.link ? (
                    <div className="text-white/70 text-sm break-all">
                      <span className="text-white/60">Link :</span> {p.link}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setParticipations((prev) =>
                        prev.map((x) => {
                          if (x.id !== p.id) { return x; }
                          const next = !x.hasLiked;
                          const nextLikes = x.likes + (next ? 1 : -1);
                          return { ...x, hasLiked: next, likes: nextLikes };
                        })
                      );
                    }}
                    className="relative w-8 h-8 hover:opacity-90"
                    aria-pressed={!!p.hasLiked}
                    aria-label={p.hasLiked ? "Unlike participation" : "Like participation"}
                  >
                    <Image
                      src={p.hasLiked ? "/like 1.png" : "/like 0.png"}
                      alt={p.hasLiked ? "Liked" : "Not liked"}
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </button>
                  <div className="mt-1 text-xs text-white/70">{formatLikes(p.likes)}</div>

                  {/* En mode Modify : bouton suppression participation */}
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => removeParticipation(p.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 text-sm"
                      aria-label="Remove participation"
                    >
                      🗑
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View more */}
        {canViewMore ? (
          <div className="mt-5 flex justify-center pb-8">
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 text-sm font-semibold"
              onClick={() =>
                setVisibleCount((v) =>
                  Math.min(v + defaultVisible, participations.length)
                )
              }
            >
              View more
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
