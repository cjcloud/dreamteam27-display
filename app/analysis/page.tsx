'use client';

import { useManagers } from '@/lib/hooks/useManagers';
import { useState } from 'react';

const normalizeNameForSearch = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function AnalysisPage() {
  const { managers, loading, error } = useManagers();
  const [showClubData, setShowClubData] = useState(false);
  const [playerSearch, setPlayerSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{
    count: number;
    results: Array<{
      playerName: string;
      playerPosition: string;
      managerName: string;
      managerPoints: number;
      managerLeaguePosition: number;
    }>;
  } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-onyx pitch-bg p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis - Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-onyx pitch-bg p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis - Error</h1>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  // Function to search for a player across all managers
  const searchForPlayer = () => {
    if (!playerSearch.trim()) {
      setSearchResults(null);
      return;
    }

    const searchTerm = normalizeNameForSearch(playerSearch);
    const playersFound: Array<{
      playerName: string;
      playerPosition: string;
      managerName: string;
      managerPoints: number;
      managerLeaguePosition: number;
    }> = [];

    managers.forEach(manager => {
      manager.teamDetails.players.forEach(player => {
        if (normalizeNameForSearch(player.name).includes(searchTerm)) {
          playersFound.push({
            playerName: player.name,
            playerPosition: player.position,
            managerName: manager.name,
            managerPoints: manager.totalPoints,
            managerLeaguePosition: manager.currentPosition
          });
        }
      });
    });

    // Sort by league position (ascending)
    playersFound.sort((a, b) => a.managerLeaguePosition - b.managerLeaguePosition);

    setSearchResults({
      count: playersFound.length,
      results: playersFound
    });
  };

  // Collect all unique clubs from all players
  const allClubs = new Set<string>();
  const clubPlayerCount: { [key: string]: number } = {};

  managers.forEach(manager => {
    manager.teamDetails.players.forEach(player => {
      allClubs.add(player.club);
      clubPlayerCount[player.club] = (clubPlayerCount[player.club] || 0) + 1;
    });
  });

  return (
    <div className="min-h-screen bg-onyx pitch-bg p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Analysis - Club & Player Data</h1>
        
        <div className="grid gap-4 sm:gap-6">
          {/* Summary Stats */}
          <div className="bg-slate-800 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{managers.length}</div>
                <div className="text-slate-300">Managers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  {managers.reduce((total, m) => total + m.teamDetails.players.length, 0)}
                </div>
                <div className="text-slate-300">Total Players</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{allClubs.size}</div>
                <div className="text-slate-300">Unique Clubs</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-400">
                  {clubPlayerCount['Unknown'] || 0}
                </div>
                <div className="text-slate-300">Unknown Players</div>
              </div>
            </div>
          </div>

          {/* Club Distribution */}
          <div className="bg-slate-800 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Distribution of Selected Clubs</h2>
              <button
                onClick={() => setShowClubData(!showClubData)}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 self-start sm:self-auto"
              >
                {showClubData ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {showClubData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 text-sm">
                {Array.from(allClubs)
                  .sort((a, b) => clubPlayerCount[b] - clubPlayerCount[a])
                  .map(club => (
                  <div 
                    key={club} 
                    className={`p-3 rounded ${
                      club === 'Unknown' ? 'bg-red-900/30 border border-red-500/30' :
                      'bg-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white text-sm sm:text-base">{club}</div>
                    <div className="text-slate-300 text-xs sm:text-sm">{clubPlayerCount[club]} players</div>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Player Search */}
          <div className="bg-slate-800 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">Player Search</h2>
            <p className="text-sm text-slate-300 mb-3">which managers have this player in their team?</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Enter player name to search..."
                value={playerSearch}
                onChange={(e) => {
                  setPlayerSearch(e.target.value);
                  setSearchResults(null);
                }}
                onKeyPress={(e) => e.key === 'Enter' && searchForPlayer()}
                className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={searchForPlayer}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>

            {searchResults && (
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <h3 className="text-lg font-semibold text-white mb-2">Search Results</h3>
                  <p className="text-slate-300">
                    <span className="font-semibold text-blue-400">{searchResults.count}</span> manager(s) have a player matching "{playerSearch}"
                  </p>
                </div>

                {searchResults.results.length > 0 && (
                  <div className="bg-slate-700 rounded-lg p-3">
                    <h4 className="text-md font-semibold text-white mb-3">Players found:</h4>
                    <div className="overflow-x-auto rounded-lg bg-[#BFE6CF] p-[3px]">
                      <table className="table-auto text-sm w-full bg-white rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-[#C8EAD6] text-[#2E3A40]">
                            <th className="text-center p-2">Player Name</th>
                            <th className="text-center p-2">Mgr Pos</th>
                            <th className="text-center p-2">Manager Name</th>
                            <th className="text-center p-2">Manager Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.results.map((result, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-[#F5F6F7]' : 'bg-white'}>
                              <td className="p-2 text-[#33414A] text-center">{result.playerName}</td>
                              <td className="p-2 text-[#33414A] text-center">{result.managerLeaguePosition}</td>
                              <td className="p-2 text-[#33414A] text-center">{result.managerName}</td>
                              <td className="p-2 text-[#33414A] text-center">{result.managerPoints}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
