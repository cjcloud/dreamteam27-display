'use client';

import Confetti from '@/components/ui/Confetti';
import { FINAL_TOP_FOUR } from '@/lib/winners';
import Image from 'next/image';
import Link from 'next/link';

export default function WinnersPage() {
  return (
    <div className="min-h-screen bg-onyx p-8 relative">
      <Confetti />

      <Image
        src="/images/football27.svg"
        alt=""
        width={50}
        height={50}
        className="animated-football-logo"
        priority
        aria-hidden
      />

      <div className="relative z-10">
        <h1 className="text-4xl mb-6 content-layer text-center md:text-left">
          <span className="text-timber">End of Season </span>
          <span className="font-bold text-tangerine">Final </span>
          <span className="font-bold text-white">Top 4</span>
        </h1>

        <p className="text-timber mb-8 content-layer text-center md:text-left">
          Congratulations to our 2025/26 season prize winners.
        </p>

        <div className="grid gap-6 md:grid-cols-2 content-layer max-w-3xl">
          {FINAL_TOP_FOUR.map((entry) => (
            <div
              key={entry.place}
              className="relative z-10 p-6 bg-payne rounded-lg shadow-lg"
            >
                <p className="text-sm font-semibold text-tangerine mb-1">{entry.label} Place</p>
              <p className="text-2xl font-bold text-timber mb-1">{entry.name}</p>
              <p className="text-xl text-timber/90">{entry.prize}</p>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-tangerine hover:text-timber transition-colors content-layer"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
