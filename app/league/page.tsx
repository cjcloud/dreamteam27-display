'use client';

import { useManagers } from '@/lib/hooks/useManagers';
import LeagueTable from '@/components/league/LeagueTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
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

export default function LeaguePage() {
  const { managers, lastUpdated, loading, error } = useManagers();

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

  const formattedDate = formatDate(lastUpdated);

  return (
    <main className="min-h-screen bg-onyx pitch-bg relative">
      {/* Content */}
      <div className="relative z-10 w-full px-1 py-4 sm:p-4">
        {/* <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
           
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
          Points so far this season
          </p>
        </div> */}

        <LeagueTable managers={managers} lastUpdated={formattedDate} />
      </div>
    </main>
  );
}
