'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

interface PlayerResult {
  managerName: string;
  playerName: string;
  playerDNP: boolean | undefined;
  playerId: string;
  club: string;
  position: string;
  gameWeekPoints: number;
  totalPoints: number;
  injured: boolean;
  suspended: boolean;
  eliminated: boolean;
}

export default function PlayerStatusPage() {
  const [allPlayers, setAllPlayers] = useState<PlayerResult[]>([]);
  const [dnpPlayers, setDnpPlayers] = useState<PlayerResult[]>([]);
  const [injuredPlayers, setInjuredPlayers] = useState<PlayerResult[]>([]);
  const [suspendedPlayers, setSuspendedPlayers] = useState<PlayerResult[]>([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<PlayerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    const managersRef = ref(db, '/0');
    
    const unsubscribe = onValue(
      managersRef,
      (snapshot) => {
        try {
          const managersData = snapshot.val();
          
          if (!managersData) {
            setError('No managers data found');
            setLoading(false);
            return;
          }

          const allPlayersData: PlayerResult[] = [];
          const dnpPlayersData: PlayerResult[] = [];
          const injuredPlayersData: PlayerResult[] = [];
          const suspendedPlayersData: PlayerResult[] = [];
          const eliminatedPlayersData: PlayerResult[] = [];
          let playerCount = 0;

          // Process managers data
          managersData.forEach((managerData: any, managerIndex: number) => {
            if (!managerData?.teamDetails) return;

            managerData.teamDetails.forEach((playerData: any) => {
              if (!playerData?.playerDetails) return;
              
              const details = playerData.playerDetails;
              const playerName = details.playerName || '';
              playerCount++;

              const playerResult: PlayerResult = {
                managerName: managerData.manager || `Manager ${managerIndex}`,
                playerName,
                playerDNP: details.playerDNP,
                playerId: playerData.playerId || 'Unknown',
                club: details.playerClub || 'Unknown',
                position: details.playerPosition || 'Unknown',
                gameWeekPoints: details.gwpts || 0,
                totalPoints: details.gwtotalPts || 0,
                injured: details.playerinjured || false,
                suspended: details.playerSuspended || false,
                eliminated: details.playereliminated || false
              };

              allPlayersData.push(playerResult);

              // Add to respective status lists
              if (details.playerDNP === true) {
                dnpPlayersData.push(playerResult);
              }
              if (details.playerinjured === true) {
                injuredPlayersData.push(playerResult);
              }
              if (details.playerSuspended === true) {
                suspendedPlayersData.push(playerResult);
              }
              if (details.playereliminated === true) {
                eliminatedPlayersData.push(playerResult);
              }
            });
          });

          setAllPlayers(allPlayersData);
          setDnpPlayers(dnpPlayersData);
          setInjuredPlayers(injuredPlayersData);
          setSuspendedPlayers(suspendedPlayersData);
          setEliminatedPlayers(eliminatedPlayersData);
          setTotalPlayers(playerCount);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Testing Wissa playerPlayed Field</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p>Loading database data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Testing Wissa playerPlayed Field</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const playedCount = allPlayers.filter((r: PlayerResult) => r.playerDNP === false).length;
  const notPlayedCount = dnpPlayers.length;
  const undefinedCount = allPlayers.filter((r: PlayerResult) => r.playerDNP === undefined).length;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📊 Player Status Dashboard</h1>
        
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPlayers}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{dnpPlayers.length}</div>
              <div className="text-sm text-gray-600">DNP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{injuredPlayers.length}</div>
              <div className="text-sm text-gray-600">Injured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{suspendedPlayers.length}</div>
              <div className="text-sm text-gray-600">Suspended</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{eliminatedPlayers.length}</div>
              <div className="text-sm text-gray-600">Eliminated</div>
            </div>
          </div>
          {undefinedCount > 0 && (
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{undefinedCount}</div>
              <div className="text-sm text-gray-600">Undefined playerDNP</div>
            </div>
          )}
        </div>

        {/* DNP Players Grid */}
        {dnpPlayers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🚫 Players Who Did Not Play ({dnpPlayers.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {dnpPlayers.map((player: PlayerResult, index: number) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm">
                  <div className="font-medium text-red-800">{player.playerName}</div>
                  <div className="text-red-600 text-xs">{player.club} • {player.managerName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Injured Players Grid */}
        {injuredPlayers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🩹 Injured Players ({injuredPlayers.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {injuredPlayers.map((player: PlayerResult, index: number) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded px-3 py-2 text-sm">
                  <div className="font-medium text-orange-800">{player.playerName}</div>
                  <div className="text-orange-600 text-xs">{player.club} • {player.managerName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suspended Players Grid */}
        {suspendedPlayers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">⚠️ Suspended Players ({suspendedPlayers.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {suspendedPlayers.map((player: PlayerResult, index: number) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-sm">
                  <div className="font-medium text-yellow-800">{player.playerName}</div>
                  <div className="text-yellow-600 text-xs">{player.club} • {player.managerName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eliminated Players Grid */}
        {eliminatedPlayers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">❌ Eliminated Players ({eliminatedPlayers.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {eliminatedPlayers.map((player: PlayerResult, index: number) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                  <div className="font-medium text-gray-800">{player.playerName}</div>
                  <div className="text-gray-600 text-xs">{player.club} • {player.managerName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {dnpPlayers.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-green-800 font-semibold mb-2">No Players with DNP = true</h2>
            <p className="text-green-700">
              All players either played this week (playerDNP = false) or have undefined playerDNP status.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dnpPlayers.map((result: PlayerResult, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{result.playerName}</h3>
                    <p className="text-gray-600">Manager: {result.managerName}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      result.playerDNP === false 
                        ? 'bg-green-100 text-green-800' 
                        : result.playerDNP === true 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      🎯 playerDNP: {result.playerDNP !== undefined ? result.playerDNP.toString() : 'undefined'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Player ID:</span> {result.playerId}
                  </div>
                  <div>
                    <span className="font-medium">Club:</span> {result.club}
                  </div>
                  <div>
                    <span className="font-medium">Position:</span> {result.position}
                  </div>
                  <div>
                    <span className="font-medium">GW Points:</span> {result.gameWeekPoints}
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.injured && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Injured</span>
                  )}
                  {result.suspended && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Suspended</span>
                  )}
                  {result.eliminated && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Eliminated</span>
                  )}
                  
                  {/* Show if player is considered active based on app logic */}
                  <span className={`px-2 py-1 rounded text-xs ${
                    (!(result.injured || result.suspended || result.eliminated || result.playerDNP))
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(!(result.injured || result.suspended || result.eliminated || result.playerDNP)) ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
