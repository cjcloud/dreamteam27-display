'use client';

import { useManagers } from '@/lib/hooks/useManagers';
import TeamCard from '@/components/team/TeamCard';
import { format } from 'date-fns';

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'Not available';
  try {
    // Parse ISO 8601 format from Firebase
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, "MMM d, yyyy 'at' HH:mm");
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const TeamsHeader = ({ lastUpdated }: { lastUpdated: string | null }) => {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2">Team Overview</h1>
      <p className="text-white/70">Last updated: {formatDate(lastUpdated)}</p>
    </header>
  );
};

const TeamsLoading = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-primary-dark/50 rounded w-48 mb-3"></div>
          <div className="h-4 bg-primary-dark/30 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-primary-dark/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamsError = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-accent-pink/10 border border-accent-pink/20 rounded-lg p-4 text-accent-pink">
          <h2 className="text-lg font-bold mb-2">Error Loading Teams</h2>
          <p>{error.message}</p>
        </div>
      </div>
    </div>
  );
};

const TeamsGrid = ({ managers }: { managers: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {managers.map((manager) => (
        <TeamCard key={manager.id} manager={manager} />
      ))}
    </div>
  );
};

export default function TeamsPage() {
  const { managers, loading, error, lastUpdated } = useManagers();

  if (loading) {
    return (
      <div className="min-h-screen bg-onyx pitch-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tangerine"></div>
          <p className="text-timber text-lg">Loading manager data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-onyx pitch-bg flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-onyx pitch-bg">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Team Overview</h1>
          <p className="text-white/70">Last updated: {formatDate(lastUpdated)}</p>
        </header>
        <TeamsGrid managers={managers} />
      </div>
    </div>
  );
}
