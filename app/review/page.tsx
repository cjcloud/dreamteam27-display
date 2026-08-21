'use client';

// Preserved former home page — hidden from the nav for now.
// Intended for end-of-season use as an information / review page.
// Accessible at /review.

import { useManagers } from '@/lib/hooks/useManagers';
import { FINAL_TOP_FOUR } from '@/lib/winners';
import Link from 'next/link';
import Image from 'next/image';
import { TrophyIcon } from '@heroicons/react/24/solid';

export default function SeasonReviewPage() {
  const { managers, loading, error } = useManagers();

  if (loading) {
    return (
      <div className="min-h-screen bg-onyx pitch-bg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-primary-dark/50 rounded w-48 mb-4"></div>
          <div className="h-4 bg-primary-dark/50 rounded w-96 mb-8"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-onyx pitch-bg p-8">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-onyx pitch-bg p-8">
      <h1 className="text-4xl mb-6 content-layer">
        <span className="text-timber">Dream</span>
        <span className="font-bold text-tangerine">Team</span>
        <span className="font-bold text-timber">
          <span className="number-animate">2</span>
          <span className="number-animate slide-delay-1">6</span>
        </span>
      </h1>

      <p className="text-timber mb-8 content-layer">
        Welcome to DreamTeam27, your team for the 2026/27 season.
      </p>

      <div className="flex flex-col gap-6 content-layer">
        <Link
          href="/winners"
          className="winners-feature-card group relative z-10 block w-full rounded-xl border border-munsell-dusk/40 p-6 md:w-1/3 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-7 w-7 text-tangerine shrink-0" aria-hidden />
              <h2 className="text-xl md:text-2xl font-bold">
                <span className="text-tangerine">Final</span>{' '}
                <span className="text-white">Top 4</span>
              </h2>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-timber/90">
              2025/26 · Season complete
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-3 mb-6" aria-label="Season winners">
            {FINAL_TOP_FOUR.map((winner) => (
              <li
                key={winner.place}
                className="rounded-lg border border-timber/15 bg-onyx px-3 py-3 md:px-4 md:py-3.5"
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    winner.place === 1 ? 'text-tangerine' : 'text-[#2563EB]'
                  }`}
                >
                  {winner.label}
                </span>
                <p className="mt-1 text-lg md:text-xl font-bold text-timber">{winner.name}</p>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-timber/20 bg-payne px-4 py-3.5 transition-colors group-hover:bg-[#607990] group-hover:border-timber/30">
            <span className="text-sm md:text-base font-semibold text-white">
              See full prize breakdown
            </span>
            <span className="text-lg font-bold text-white" aria-hidden>
              →
            </span>
          </div>
        </Link>

        <div className="grid max-w-4xl gap-6 md:grid-cols-2">
          <Link
            href="/teams"
            className="p-6 bg-payne rounded-lg shadow-lg hover:bg-munsell transition-colors"
          >
            <h2 className="text-xl font-bold text-timber mb-2">View Teams</h2>
            <p className="text-timber/80">
              Check out all participating teams and their current standings.
            </p>
          </Link>

          <Link
            href="/league"
            className="p-6 bg-payne rounded-lg shadow-lg hover:bg-munsell transition-colors"
          >
            <h2 className="text-xl font-bold text-timber mb-2">League Table</h2>
            <p className="text-timber/80">
              See the current league standings and points.
            </p>
          </Link>
        </div>
      </div>

      <Image
        src="/images/football27.svg"
        alt="Football 27 Logo"
        width={50}
        height={50}
        className="animated-football-logo"
        priority
      />
    </div>
  );
}
