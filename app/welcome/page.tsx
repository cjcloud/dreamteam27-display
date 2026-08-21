import Link from 'next/link';
import BouncingBall from '@/components/welcome/BouncingBall';

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-dt-bg text-center px-4">
      <div className="content-layer max-w-2xl mx-auto pb-40 sm:pb-48">
        <h1 className="text-3xl sm:text-5xl mb-4 leading-tight">
          <span className="text-dt-content font-bold">Welcome to </span>
          <span className="text-dt-content font-normal">Dream</span>
          <span className="text-dt-accent font-bold">Team</span>
          <span className="text-dt-content font-bold">27</span>
        </h1>
        <p className="text-lg sm:text-xl text-dt-accent mb-10">
          The one-team-for-a-season game.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/teams"
            className="px-8 py-3 rounded-md bg-dt-surface-2 text-dt-primary-contrast font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Teams
          </Link>
          <Link
            href="/league"
            className="px-8 py-3 rounded-md bg-dt-accent text-dt-bg font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            League
          </Link>
          <Link
            href="/prizes"
            className="welcome-prizes-btn px-8 py-3 rounded-md bg-dt-bg border-2 border-dt-accent text-dt-accent font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Prizes
          </Link>
        </div>
      </div>

      {/* Bouncing ball: physics-driven drop across the page, settling at the bottom. */}
      <BouncingBall />
    </div>
  );
}
