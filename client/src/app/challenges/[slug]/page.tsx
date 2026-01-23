'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'; // Remplacer avec le bon chemin

// hook responsive
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);
  return matches;
}

type Participation = {
  id: string;
  userId: string;
  name: string;
  description: string;
  scoreLabel: string;
  link?: string;
  hasVoted?: boolean;
  likes: number;
};

type ChallengeDetails = {
  id: string;
  slug: string;
  title: string;
  description: string;
  details: string[];
  scoreFormat: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdById: string;
  gameId: string;
  gameSlug?: string;
  gameTitle: string;
  gameImage: string;
  hasVoted?: boolean;
  likes: number;

  participations: Participation[];
};

// Description avec max 100 chars
const clamp100 = (s: string) => {
  const t = (s ?? '').trim();
  if (t.length <= 100) {
    return t;
  }
  return `${t.slice(0, 97)}...`;
};

const clampParticipation = (s: string | undefined | null, max = 120) => {
  const t = (s ?? '').trim();
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, Math.max(0, max - 3))}...`;
};

function buildChallengeDescription(desc: string, details: string[]) {
  const cleanDesc = (desc ?? '').trim();
  const cleanDetails = (details ?? []).map((d) => d.trim()).filter(Boolean);

  if (cleanDetails.length === 0) {
    return cleanDesc;
  }

  return `${cleanDesc}\n\nDetails:\n${cleanDetails.join('\n')}`;
}

function splitDescriptionAndDetails(raw: string): { desc: string; details: string[] } {
  const text = (raw ?? '').replace(/\r\n/g, '\n').trim();
  const re = /\n\s*details\s*:?\s*\n/i;
  const parts = text.split(re);
  if (parts.length < 2) {
    return { desc: text, details: [] };
  }

  const desc = (parts[0] ?? '').trim();
  const detailsBlock = (parts[1] ?? '').trim();

  const details = detailsBlock
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return { desc, details };
}

export default function ChallengeDetailsPage() {
  const router = useRouter();
  const { user, token } = useAuth() as any; // token si ton AuthContext l’expose
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const searchParams = useSearchParams();

  const isMd = useMediaQuery('(min-width: 768px)');
  const defaultVisible = isMd ? 4 : 3;

  // core state
  const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // UI state
  const [challengeHasLiked, setChallengeHasLiked] = useState(false);
  const [challengeLikes, setChallengeLikes] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const [descriptionPoints, setDescriptionPoints] = useState<string[]>([]);
  const [detailsPoints, setDetailsPoints] = useState<string[]>([]);

  const [participations, setParticipations] = useState<Participation[]>([]);
  const [visibleCount, setVisibleCount] = useState(defaultVisible);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('view');
  const [activeParticipationId, setActiveParticipationId] = useState<string | null>(null);

  // Champs du formulaire (create / edit)
  const [pDesc, setPDesc] = useState('');
  const [pLink, setPLink] = useState('');

  // Fetch challenge
  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${baseUrl}/challenges/${slug}`, {
          cache: 'no-store'
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(msg || `Failed to load challenge (${res.status})`);
        }

        const data = await res.json();

        const raw = (data?.challenge ?? data) as any;

        // Normalisation
        const normalized: ChallengeDetails = {
          id: raw.id,
          slug: raw.slug,
          title: raw.title ?? '',
          description: raw.description ?? '',
          details: Array.isArray(raw.details) ? raw.details : [],
          scoreFormat: raw.scoreFormat ?? '',
          createdAt: raw.createdAt ?? '',
          updatedAt: raw.updatedAt ?? '',
          createdBy: raw.creator?.username ?? '—',
          createdById: raw.createdBy?.id ?? raw.createdById ?? '',
          gameId: raw.gameId ?? raw.game?.id ?? '',
          gameSlug: raw.game?.slug ?? raw.gameSlug ?? raw.gameId ?? '',
          gameTitle: raw.game?.title ?? raw.gameTitle ?? '',
          gameImage: raw.game?.imageUrl ?? raw.gameImage ?? '',

          likes: raw.voteCount ?? raw.likes ?? 0,
          hasVoted: Boolean(raw.hasVoted),

          participations: (raw.participations ?? []).map((p: any) => ({
            id: p.id,
            userId: p.userId,
            name: p.user?.username ?? p.user?.name ?? p.username ?? '—',
            description: p.description ?? '',
            scoreLabel: p.scoreLabel ?? '-', // pas en seed -> placeholder
            link: p.submissionUrl ?? p.link ?? undefined,
            likes: p.voteCount ?? p.likes ?? 0,
            hasVoted: Boolean(p.hasVoted)
          }))
        };

        if (!cancelled) {
          setChallenge(normalized);
        }
      } catch (e: any) {
        if (!cancelled) {
          setLoadError(e?.message ?? 'Failed to load');
          setChallenge(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!challenge) {
      return;
    }

    setChallengeHasLiked(Boolean(challenge.hasVoted));
    setChallengeLikes(challenge.likes);

    setIsEditing(false);
    setTitle(challenge.title);
    setImageUrl(undefined); // API n’a pas image custom dans la seed

    const parsed = splitDescriptionAndDetails(challenge.description);

    const finalDetails =
      parsed.details.length > 0 ? parsed.details : (challenge.details ?? []).filter(Boolean);

    setDescriptionPoints([parsed.desc]);
    setDetailsPoints(finalDetails);

    setParticipations(challenge.participations ?? []);
  }, [challenge]);

  useEffect(() => {
    setVisibleCount(defaultVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMd]);

  const activeParticipation = useMemo(() => {
    if (!activeParticipationId) {
      return null;
    }
    return participations.find((p) => p.id === activeParticipationId) ?? null;
  }, [activeParticipationId, participations]);

  const currentUserId = user?.id ?? ''; // à revoir avec l'auth
  const isChallengeOwner = Boolean(
    challenge?.createdById && challenge.createdById === currentUserId
  );
  const isOwnActiveParticipation = Boolean(
    activeParticipation && activeParticipation.userId === currentUserId
  );

  useEffect(() => {
    const participationId = searchParams.get('participationId');
    if (!participationId) {
      return;
    }

    const p = participations.find((x) => x.id === participationId);
    if (!p) {
      return;
    }

    setModalMode('view');
    setActiveParticipationId(participationId);
    setPDesc(p.description ?? '');
    setPLink(p.link ?? '');
    setIsModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, participations]);

  // Helpers UI
  const headerImage = imageUrl?.trim()
    ? imageUrl
    : challenge?.gameImage?.trim()
      ? challenge.gameImage
      : '/real-rat.png';

  const formatLikes = (n: number) => `${n}`;

  const displayedParticipations = participations.slice(0, visibleCount);
  const canViewMore = visibleCount < participations.length;

  const authHeaders = (): Record<string, string> => {
    const t = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (!t) {
      return {};
    }
    return { Authorization: `Bearer ${t}` };
  };

  const saveEdits = async () => {
    if (!challenge) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const payload = {
      title: title.trim(),
      scoreFormat: challenge.scoreFormat,
      description: buildChallengeDescription(clamp100(descriptionPoints[0] ?? ''), detailsPoints)
    };

    const res = await fetch(`${baseUrl}/challenges/${challenge.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to save');
      return;
    }

    setChallenge((prev) =>
      prev
        ? {
            ...prev,
            title: payload.title,
            description: payload.description
          }
        : prev
    );

    setIsEditing(false);
  };

  const cancelEdits = () => {
    if (!challenge) {
      return;
    }
    const parsed = splitDescriptionAndDetails(challenge.description);

    setTitle(challenge.title);
    setImageUrl(undefined);
    setDescriptionPoints([parsed.desc]);
    setDetailsPoints(parsed.details);
    setIsEditing(false);
  };

  const addBullet = (kind: 'desc' | 'details') => {
    if (kind === 'desc') {
      setDescriptionPoints((p) => [...p, '']);
    } else {
      setDetailsPoints((p) => [...p, '']);
    }
  };

  const updateBullet = (kind: 'desc' | 'details', idx: number, val: string) => {
    if (kind === 'desc') {
      setDescriptionPoints((p) => p.map((x, i) => (i === idx ? val : x)));
    } else {
      setDetailsPoints((p) => p.map((x, i) => (i === idx ? val : x)));
    }
  };

  const removeBullet = (kind: 'desc' | 'details', idx: number) => {
    if (kind === 'desc') {
      setDescriptionPoints((p) => p.filter((_, i) => i !== idx));
    } else {
      setDetailsPoints((p) => p.filter((_, i) => i !== idx));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode('view');
    setActiveParticipationId(null);
    setPDesc('');
    setPLink('');
  };

  const openCreateModal = () => {
    setModalMode('create');
    setActiveParticipationId(null);
    setPDesc('');
    setPLink('');
    setIsModalOpen(true);
  };

  const openViewModal = (pId: string) => {
    const p = participations.find((x) => x.id === pId);
    setModalMode('view');
    setActiveParticipationId(pId);
    setPDesc(p?.description ?? '');
    setPLink(p?.link ?? '');
    setIsModalOpen(true);
  };

  const openEditModalForActive = () => {
    if (!activeParticipation) {
      return;
    }
    setModalMode('edit');
    setPDesc(activeParticipation.description ?? '');
    setPLink(activeParticipation.link ?? '');
  };

  // Ces 3 actions nécessitent des routes côté Express (participations)
  const submitCreate = async () => {
    if (!challenge) {
      return;
    }

    const desc = pDesc.trim();
    const link = pLink.trim();
    const submissionUrl = link && /^https?:\/\/.+/i.test(link) ? link : null;

    if (!desc) {
      alert('Description required');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const res = await fetch(`${baseUrl}/participation/challenges/${challenge.id}/participations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ description: desc, submissionUrl })
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to create participation');
      return;
    }

    const { participation } = await res.json();

    // Ajout direct dans la liste
    setParticipations((prev) => [
      {
        id: participation.id,
        userId: participation.userId,
        name: participation.user.username,
        description: participation.description,
        link: participation.submissionUrl ?? undefined,
        scoreLabel: '-',
        likes: 0,
        hasLiked: false
      },
      ...prev
    ]);

    closeModal();
  };

  const saveEdit = async () => {
    if (!activeParticipation) {
      return;
    }
    const desc = pDesc.trim();
    const link = pLink.trim();
    if (!desc) {
      return;
    }

    // PATCH /participations/:id
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${baseUrl}/participation/participations/${activeParticipation.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ description: desc, submissionUrl: link || null })
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to update participation');
      return;
    }

    setParticipations((prev) =>
      prev.map((x) =>
        x.id === activeParticipation.id ? { ...x, description: desc, link: link || undefined } : x
      )
    );

    setModalMode('view');
  };

  const deleteActiveParticipation = async () => {
    if (!activeParticipation) {
      return;
    }

    // DELETE /participation/:id
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${baseUrl}/participation/participations/${activeParticipation.id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
      credentials: 'include'
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to delete participation');
      return;
    }

    setParticipations((prev) => prev.filter((x) => x.id !== activeParticipation.id));
    closeModal();
  };

  // Like challenge
  const toggleChallengeLike = async () => {
    if (!challenge) {
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (challengeHasLiked) {
      await fetch(`${baseUrl}/challengeVote/challenges/${challenge.id}/vote`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setChallengeHasLiked(false);
    } else {
      await fetch(`${baseUrl}/challengeVote/challenges/${challenge.id}/vote`, {
        method: 'POST',
        credentials: 'include'
      });
      setChallengeHasLiked(true);
    }
  };

  const toggleParticipationLike = async (p: Participation) => {
    if (!challenge) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const next = !p.hasVoted;

    setParticipations((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, hasVoted: next, likes: x.likes + (next ? 1 : -1) } : x
      )
    );

    // Todo link to the bdd line exist in bdd
    const res = await fetch(`${baseUrl}/participation/participations/${p.id}/votes`, {
      method: challenge.hasVoted ? 'POST' : 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      setParticipations((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, hasVoted: !next, likes: x.likes + (next ? -1 : 1) } : x
        )
      );
    }
  };

  const onToggleChallengeLike = () => {
    toggleChallengeLike();
  };

  const onToggleParticipationLike = (pId: string) => {
    const p = participations.find((x) => x.id === pId);
    if (!p) {
      return;
    }
    toggleParticipationLike(p);
  };

  // Todo remove participations does not send to the right back adress
  const removeParticipation = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${baseUrl}/participation/participations/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to delete participation');
      return;
    }

    setParticipations((prev) => prev.filter((x) => x.id !== id));
    if (activeParticipationId === id) {
      closeModal();
    }
  };

  const deleteActive = async () => {
    await deleteActiveParticipation();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-white/70">Loading...</div>
      </div>
    );
  }

  if (loadError || !challenge) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-white font-semibold">Challenge not found</div>
          <div className="text-white/60 mt-2">
            {loadError ? loadError : 'No data returned from API.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <main className="mx-auto w-full max-w-[430px] md:max-w-5xl px-4 md:px-8 py-5 md:py-8">
        <div className="rounded-3xl bg-(--background-header)/70 ring-1 ring-background/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="relative h-32 md:h-48 lg:h-64 w-full bg-(--button-area)">
            <Image src={headerImage} alt={title} fill sizes="430px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/15 to-transparent" />
          </div>

          <div className="p-5 md:p-8">
            <div className="flex items-start justify-between gap-3">
              {!isEditing ? (
                <h1 className="text-2xl md:text-4xl font-semibold leading-tight">{title}</h1>
              ) : (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-2xl font-semibold focus:outline-none"
                  placeholder="Challenge title"
                />
              )}

              <div className="flex flex-col items-center leading-none">
                <button
                  type="button"
                  onClick={onToggleChallengeLike}
                  className="relative w-10 h-10 shrink-0 hover:opacity-90"
                  aria-pressed={challengeHasLiked}
                  aria-label={challengeHasLiked ? 'Unlike challenge' : 'Like challenge'}
                >
                  <Image
                    src={challengeHasLiked ? '/vote 1.png' : '/vote 0.png'}
                    alt={challengeHasLiked ? 'Voted' : 'Not voted'}
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </button>
                <div className="mt-1 text-xs text-foreground/70">{formatLikes(challengeLikes)}</div>
              </div>
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="text-foreground/80">
                <div className="text-sm">
                  <span className="text-foreground/60">Game :</span>{' '}
                  <Link
                    href={`/games/${challenge.gameSlug ?? challenge.gameId}`}
                    className="text-xs font-semibold tracking-widest text-(--button-select)/90 mb-2 hover:underline"
                  >
                    {challenge.gameTitle}
                  </Link>
                </div>
                <div className="text-sm">
                  <span className="text-foreground/60">Created by</span>{' '}
                  <span className="font-semibold">{challenge.createdBy}</span>
                </div>
              </div>

              {isChallengeOwner ? (
                !isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                  >
                    Modify
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelEdits}
                      className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveEdits}
                      className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                    >
                      Save
                    </button>
                  </div>
                )
              ) : null}
            </div>

            {isEditing ? (
              <div className="mt-4">
                <div className="text-sm font-semibold text-foreground/80 mb-2">Image URL</div>
                <input
                  value={imageUrl ?? ''}
                  onChange={(e) => setImageUrl(e.target.value || undefined)}
                  className="w-full bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="https://..."
                />
                <div className="text-xs text-foreground/50 mt-2">
                  Laisse vide pour afficher l’image du jeu par défaut.
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-(--button-select)" />
                  <div className="font-semibold">Description :</div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-950/30 ring-1 ring-background/10 p-3">
                {!isEditing ? (
                  <div className="text-foreground/85">{clamp100(descriptionPoints[0] ?? '')}</div>
                ) : (
                  <div className="flex items-start gap-3">
                    <textarea
                      value={descriptionPoints[0] ?? ''}
                      maxLength={100}
                      onChange={(e) => setDescriptionPoints([e.target.value])}
                      className="flex-1 bg-(--background-header)/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none min-h-[44px]"
                      placeholder="Description (max 100 chars)"
                    />
                    <div className="text-xs text-foreground/50 w-12 text-right pt-2">
                      {(descriptionPoints[0] ?? '').length}/100
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-(--button-select)" />
                  <div className="font-semibold">Challenge Details :</div>
                </div>

                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => addBullet('details')}
                    className="text-sm text-foreground/70 hover:text-foreground"
                  >
                    + Add
                  </button>
                ) : null}
              </div>

              <div className="mt-3 rounded-2xl bg-slate-950/30 ring-1 ring-background/10 p-3">
                <ul className="space-y-2">
                  {detailsPoints.map((txt, idx) => (
                    <li key={`det-${idx}`} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-foreground/70 shrink-0" />
                      {!isEditing ? (
                        <div className="text-foreground/85">{txt}</div>
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            value={txt}
                            onChange={(e) => updateBullet('details', idx, e.target.value)}
                            className="flex-1 bg-slate-950/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet('details', idx)}
                            className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
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

            <div className="mt-6 flex justify-center md:justify-end">
              {user ? (
                <button
                  type="button"
                  className="px-10 py-3 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
                  onClick={openCreateModal}
                >
                  Participate
                </button>
              ) : (
                <div>
                  <p className="text-center">Connection required to participate</p>
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Participations list */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedParticipations.map((p) => (
            <div
              key={p.id}
              onClick={() => openViewModal(p.id)}
              className="cursor-pointer rounded-2xl bg-slate-900/70 ring-1 ring-background/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-white/70 text-sm">{p.scoreLabel}</div>
                  {p.description ? (
                    <div className="mt-2 text-white/80 text-sm leading-snug break-words">
                      {clampParticipation(p.description, 120)}
                    </div>
                  ) : null}
                  {p.link ? (
                    <div className="text-white/70 text-sm break-all">
                      <span className="text-white/60">Link :</span> {p.link}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex flex-col items-center leading-none"
                  >
                    <button
                      type="button"
                      onClick={() => onToggleParticipationLike(p.id)}
                      className="relative w-8 h-8 hover:opacity-90"
                      aria-pressed={!!p.hasVoted}
                      aria-label={p.hasVoted ? 'Unlike participation' : 'Like participation'}
                    >
                      <Image
                        src={p.hasVoted ? '/vote 1.png' : '/vote 0.png'}
                        alt={p.hasVoted ? 'Voted' : 'Not voted'}
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </button>
                    <div className="mt-1 text-xs text-white/70">{formatLikes(p.likes)}</div>

                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => removeParticipation(p.id)}
                        className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
                        aria-label="Remove participation"
                      >
                        🗑
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {canViewMore ? (
          <div className="mt-5 flex justify-center pb-8">
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold"
              onClick={() =>
                setVisibleCount((v) => Math.min(v + defaultVisible, participations.length))
              }
            >
              View more
            </button>
          </div>
        ) : null}

        {/* Modal */}
        {isModalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="w-full max-w-[430px] md:max-w-xl rounded-3xl bg-slate-900 ring-1 ring-background/10 shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="font-semibold">
                  {modalMode === 'create' ? 'New participation' : 'Participation'}
                </div>

                {modalMode !== 'create' && isOwnActiveParticipation ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteActive();
                    }}
                    className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
                    aria-label="Delete participation"
                    title="Delete"
                  >
                    🗑
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="text-sm font-semibold text-white/80 mb-2">Description</div>
                  {modalMode === 'view' ? (
                    <div className="rounded-2xl bg-slate-950/30 ring-1 ring-background/10 p-3 text-white/85 whitespace-pre-wrap">
                      {activeParticipation?.description ?? ''}
                    </div>
                  ) : (
                    <textarea
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className="w-full rounded-2xl bg-slate-950/30 ring-1 ring-background/10 p-3 text-sm text-white/90 focus:outline-none resize-none min-h-[100px]"
                      placeholder="Your participation description..."
                    />
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-white/80 mb-2">Link</div>
                  {modalMode === 'view' ? (
                    <div className="rounded-2xl bg-slate-950/30 ring-1 ring-background/10 p-3 text-white/85 break-all">
                      {activeParticipation?.link ? activeParticipation.link : '—'}
                    </div>
                  ) : (
                    <input
                      value={pLink}
                      onChange={(e) => setPLink(e.target.value)}
                      className="w-full rounded-2xl bg-slate-950/30 ring-1 ring-background/10 px-3 py-3 text-sm text-white/90 focus:outline-none"
                      placeholder="https://..."
                    />
                  )}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/10 flex items-center justify-end gap-2">
                {modalMode === 'view' ? (
                  <>
                    {isOwnActiveParticipation ? (
                      <button
                        type="button"
                        onClick={openEditModalForActive}
                        className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                      >
                        Modify
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (modalMode === 'edit') {
                          setModalMode('view');
                        } else {
                          closeModal();
                        }
                      }}
                      className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={modalMode === 'create' ? submitCreate : saveEdit}
                      className="px-8 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
