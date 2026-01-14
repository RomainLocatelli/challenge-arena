/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function GamesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [visiblePages, setVisiblePages] = useState(4);

    // TODO: remplacer par les jeux réels
    const games = Array(9).fill({
        title: 'Dark Game',
        image: '/real-rat.png'
    });

return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

    <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        
        
    {/* Search Bar */}
        <div className="mb-8">
            <div className="relative max-w-md md:max-w-2xl mx-auto">
                <div className="absolute inset-0 rounded-full bg-(--searchbar-color) ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-12 w-12 flex items-center justify-center shadow">
                    <Image
                    src="/loupe.png"
                    width={100}
                    height={100}
                    alt="Search Icon"
                    className="opacity-80"
                    />
                </div>

                    <input
                    type="text"
                    placeholder="Search a game..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="relative w-full rounded-full bg-transparent py-3 pl-14 pr-4 text-white text-center text-xl placeholder:text-white/50 focus:outline-none"
                    />
                </div>
            </div>

    {/* Games Section */}
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 border-l-4 border-purple-600 pl-3">
                Games
            </h2>
    
    {/* Games icons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {games.map((game, index) => (
                <div
                key={index}
                className="bg-slate-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-600 transition-all cursor-pointer"
                >
                <div className="aspect-square bg-slate-700 relative">
                    <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-3">
                    <h3 className="font-semibold">{game.title}</h3>
                </div>
                </div>
            ))}
            </div>
        </div>

   {/* Pages */}
        <div className="flex justify-center gap-2 mb-12">
            {Array.from({ length: visiblePages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPage === page
                            ? "bg-purple-600"
                            : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </button>
            ))}

                <button
                type="button"
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center"
                onClick={() => setVisiblePages((v) => v + 4)}
                >
                ...
                </button>
        </div>
    </main>

    </div>
    );
}