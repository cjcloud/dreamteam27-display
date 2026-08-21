'use client';

import { useMemo } from 'react';
import { Big_Shoulders_Display, Space_Mono } from 'next/font/google';
import { useManagers } from '@/lib/hooks/useManagers';

const bigShoulders = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-prizes-display',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-prizes-mono',
});

const PRIZES = [
  { position: 1, label: '1st', chip: 'Champion', amount: 150 },
  { position: 2, label: '2nd', chip: 'Runner-up', amount: 80 },
  { position: 3, label: '3rd', chip: '3rd Place', amount: 50 },
  { position: 4, label: '4th', chip: '4th Place', amount: 30 },
] as const;

const TOTAL_POT = PRIZES.reduce((sum, p) => sum + p.amount, 0);

export default function PrizesPage() {
  const { managers, loading, lastUpdated } = useManagers();

  // Current top 4 by league position, sourced live from Firebase via useManagers
  // (the same hook /league uses) â€” no hardcoded names.
  const topFour = useMemo(
    () => [...managers].sort((a, b) => a.currentPosition - b.currentPosition).slice(0, 4),
    [managers]
  );

  return (
    <div
      className={`${bigShoulders.variable} ${spaceMono.variable} prizes-page relative overflow-hidden bg-dt-bg text-dt-content`}
    >
      <div className="prizes-floodlight prizes-fl-left" aria-hidden="true" />
      <div className="prizes-floodlight prizes-fl-right" aria-hidden="true" />

      <div className="prizes-ticker">
        <div className="prizes-ticker-track">
          {[0, 1].map((rep) => (
            <span key={rep} className="contents">
              {PRIZES.map((p) => (
                <span key={`${rep}-${p.position}`} className="prizes-ticker-item">
                  {p.label.toUpperCase()} PLACE &pound;{p.amount}
                </span>
              ))}
              <span className="prizes-ticker-item prizes-ticker-plain">
                &pound;{TOTAL_POT} TOTAL POT &mdash; PAYS OUT AFTER FINAL GAMEWEEK
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2 md:items-center pt-10 md:pt-16 pb-8">
        <header>
          <p className="prizes-eyebrow">2026/27 Season</p>
          <h1 className="prizes-title">
            Season&apos;s
            <br />
            <span className="prizes-glow">Prizes</span>
          </h1>
          <p className="mt-4 text-dt-content-muted max-w-[42ch] leading-relaxed">
            Four places pay out when the final whistle blows on Gameweek 38. Here&apos;s what&apos;s on the
            table.
          </p>
          <div className="prizes-pot-line mt-5">
            Total prize pot <b>&pound;{TOTAL_POT}</b>
          </div>
        </header>

        <div>
          <p className="prizes-col-label">Payout by position</p>
          <div className="flex flex-col gap-3">
            {PRIZES.map((p) => (
              <div key={p.position} className={`prizes-row prizes-rank-${p.position}`}>
                <div className="prizes-medal">{p.position}</div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="prizes-chip">{p.chip}</span>
                  <span className="prizes-ordinal">{p.label} Place</span>
                </div>
                <div className="prizes-amount ml-auto">&pound;{p.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <div className="overflow-x-auto rounded-lg border border-dt-border bg-[rgba(23,27,36,0.85)]">
          <table className="w-full text-sm" style={{ fontFamily: 'var(--font-prizes-mono), ui-monospace, monospace' }}>
            <thead>
              <tr className="bg-white/[0.03] text-dt-content-muted">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-bold">
                  Current Position
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wide font-bold">Manager</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wide font-bold">
                  Prize
                  <span className="block normal-case text-[10px] tracking-wide text-[#ff9d5c] mt-0.5">
                    provisional
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-dt-content-muted">
                    Loading current standings&hellip;
                  </td>
                </tr>
              )}
              {!loading && topFour.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-dt-content-muted">
                    No standings yet &mdash; check back once Gameweek 1 kicks off.
                  </td>
                </tr>
              )}
              {!loading &&
                topFour.map((manager, i) => (
                  <tr key={manager.id} className="border-t border-dt-border">
                    <td className="px-4 py-3">{PRIZES[i].label}</td>
                    <td className="px-4 py-3">{manager.name}</td>
                    <td className="px-4 py-3 text-right italic line-through decoration-[#7a8290]/60 text-[#7a8290] font-medium">
                      &pound;{PRIZES[i].amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-dt-border font-bold text-dt-accent">
                <td colSpan={2} className="px-4 py-3">
                  Total pot
                </td>
                <td className="px-4 py-3 text-right">&pound;{TOTAL_POT.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-4 text-center text-dt-content-muted text-sm leading-relaxed">
          Shown above: current league positions{lastUpdated ? ` as of ${lastUpdated}` : ''}. Standings will
          move throughout the season &mdash;{' '}
          <strong className="text-dt-content">
            final positions on Gameweek 38 will confirm the prize money.
          </strong>{' '}
          Payout method: <span className="text-dt-primary font-mono">[confirm before deploy]</span>.
        </p>
      </div>
    </div>
  );
}
