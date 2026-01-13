"use client";

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-8 px-6">
            <div className="max-w-6xl mx-auto">

        {/* Logo et titre */}
        <div className="flex items-center gap-2 mb-8">
            <div>
                <Image className="h-16 w-16" src="/icone-manette.png" width={80} height={80} alt="gamerchallenge logo" />
            </div>
                <h2 className="text-xl font-bold">GamerChallenge</h2>
        </div>

        {/* Liens du footer */}
        <div className="grid grid-cols-2 md:flex md:justify-end md:gap-8 gap-4 mb-8">
            <a 
            href="/about" 
            className="text-gray-300 hover:text-white transition-colors"
            >
                About Us
            </a>
            <a 
            href="/leaderboards" 
            className="text-gray-300 hover:text-white transition-colors"
            >
                Leaderboards
            </a>
            <a 
            href="/terms" 
            className="text-gray-300 hover:text-white transition-colors"
            >
                Terms of Service
            </a>
            <a 
            href="/privacy" 
            className="text-gray-300 hover:text-white transition-colors"
            >
                Privacy Policy
            </a>
            <a 
            href="/support" 
            className="text-gray-300 hover:text-white transition-colors"
            >
                Support
            </a>
        </div>

        {/* Ligne de séparation */}
            <div className="border-t border-slate-700 pt-6">
            </div>
        </div>
    </footer>
    );
}