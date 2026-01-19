"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

// Description avec max 100 chars
const clamp100 = (s: string) => {
  const t = (s ?? "").trim();
  if (t.length <= 100) {
    return t;
  }
  return `${t.slice(0, 97)}...`;
};

type GameOption = {
  id: string;
  title: string;
  imageUrl?: string;
};

export default function CreateChallengePage() {
  const router = useRouter();

  const isMd = useMediaQuery("(min-width: 768px)");

  // TODO: remplacer par session user
  const currentUserName = "NailMaster";

  // TODO: remplacer par fetch / BDD (liste de jeux)
  const games: GameOption[] = useMemo(
    () => [
      { id: "hollow-knight", title: "Hollow Knight", imageUrl: "/real-rat.png" },
      { id: "elden-ring", title: "Elden Ring", imageUrl: "/real-rat.png" },
      { id: "skyrim", title: "The Elder Scrolls V: Skyrim", imageUrl: "/real-rat.png" },
    ],
    []
  );

  // Etat du formulaire (mode "edit" uniquement)
  const [title, setTitle] = useState("");
  const [createdBy, setCreatedBy] = useState("NailMaster"); // TODO: session user
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState("");
  const [detailsPoints, setDetailsPoints] = useState<string[]>([
  ]);

  const selectedGame = useMemo(
    () => games.find((g) => g.id === gameId) ?? null,
    [games, gameId]
  );

  const headerImage = imageUrl.trim()
    ? imageUrl.trim()
    : selectedGame?.imageUrl || "/real-rat.png";

  // Gestion des lignes à puces (details)
  const addBullet = () => setDetailsPoints((p) => [...p, ""]);
  const updateBullet = (idx: number, val: string) =>
    setDetailsPoints((p) => p.map((x, i) => (i === idx ? val : x)));
  const removeBullet = (idx: number) =>
    setDetailsPoints((p) => p.filter((_, i) => i !== idx));

  const canCreate = useMemo(() => {
    const t = title.trim();
    const d = description.trim();
    return Boolean(gameId) && t.length > 0 && d.length > 0;
  }, [gameId, title, description]);

  const createChallenge = async () => {
    // TODO BDD: POST /challenges
    // Exemple payload:
    // {
    //   title,
    //   createdBy,
    //   gameId,
    //   imageUrl: imageUrl.trim() || undefined,
    //   descriptionPoints: [clamp100(description)],
    //   detailsPoints: detailsPoints.map((x) => x.trim()).filter(Boolean),
    // }
    //
    // Ici on simule:
    const fakeSlug =
      title
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "") || `challenge-${Date.now()}`;

    // redirige vers la page détail (adapte "challenge" vs "challenges" selon ton routing)
    router.push(`/challenge/${fakeSlug}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-[430px] md:max-w-5xl px-4 md:px-8 py-5 md:py-8">
        {/* Card principale */}
        <div className="rounded-3xl bg-slate-900/70 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
          {/* Header */}
          <div className="relative h-32 md:h-48 lg:h-64 w-full bg-slate-800">
            <Image
              src={headerImage}
              alt={title || "New challenge"}
              fill
              sizes="(max-width: 767px) 430px, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          </div>

          {/* Contenu */}
          <div className="p-5 md:p-8">
            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-2xl md:text-4xl font-semibold focus:outline-none text-center"
                placeholder="Challenge title"
              />
            </div>

            {/* Meta (Game + Created by) */}
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="text-white/80 space-y-2">
                <div className="text-sm">
                  <span className="text-white/60">Game :</span>{" "}
                  <select
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="ml-2 bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id} className="bg-slate-950">
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm">
                  <span className="text-white/60">Created by</span>{" "}
                  <span className="font-semibold">{currentUserName}</span>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="mt-4">
              <div className="text-sm font-semibold text-white/80 mb-2">Image URL</div>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="https://..."
              />
              <div className="text-xs text-white/50 mt-2">
                Laisse vide pour afficher l’image du jeu par défaut.
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-purple-600" />
                  <div className="font-semibold">Description :</div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-950/30 ring-1 ring-white/10 p-3">
                <div className="flex items-start gap-3">
                  <textarea
                    value={description}
                    maxLength={100}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex-1 bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none min-h-[44px]"
                    placeholder="Description (max 100 chars)"
                  />
                  <div className="text-xs text-white/50 w-12 text-right pt-2">
                    {description.length}/100
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Details */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-purple-600" />
                  <div className="font-semibold">Challenge Details :</div>
                </div>

                <button
                  type="button"
                  onClick={addBullet}
                  className="text-sm text-white/70 hover:text-white"
                >
                  + Add
                </button>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-950/30 ring-1 ring-white/10 p-3">
                <ul className="space-y-2">
                  {detailsPoints.map((txt, idx) => (
                    <li key={`det-${idx}`} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-white/70 shrink-0" />
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          value={txt}
                          onChange={(e) => updateBullet(idx, e.target.value)}
                          className="flex-1 bg-slate-950/40 ring-1 ring-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                          placeholder={`Detail ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(idx)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 text-sm"
                          aria-label="Remove detail item"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {detailsPoints.length === 0 ? (
                  <div className="text-sm text-white/60">No details yet. Add one.</div>
                ) : null}
              </div>
            </div>

            {/* Create */}
            <div className="mt-6 flex justify-center md:justify-end">
              <button
                type="button"
                disabled={!canCreate}
                onClick={createChallenge}
                className={`px-10 py-3 rounded-full font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.45)] ${
                  canCreate
                    ? "bg-amber-600/80 hover:bg-amber-600"
                    : "bg-slate-700 text-white/50 cursor-not-allowed"
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
