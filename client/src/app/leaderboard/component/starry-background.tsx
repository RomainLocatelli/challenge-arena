'use client';
import { useState } from 'react';

const animations = [
  'animate-twinkle-1',
  'animate-twinkle-2',
  'animate-twinkle-3',
  'animate-twinkle-4',
  'animate-twinkle-5',
  'animate-twinkle-6'
];

export default function PodiumStars() {
  const [stars] = useState(() => {
    const opacities = [
      'bg-white/40',
      'bg-[url(/real-rat.png)] bg-cover',
      'bg-white/60',
      'bg-white/70'
    ];

    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() > 0.5 ? 'w-1.5 h-1.5' : 'w-1 h-1',
      opacity: opacities[Math.floor(Math.random() * opacities.length)],
      animation: animations[Math.floor(Math.random() * animations.length)]
    }));
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute ${star.size} rounded-full ${star.opacity} ${star.animation} `}
          style={{
            top: star.top,
            left: star.left
          }}
        />
      ))}
    </div>
  );
}
