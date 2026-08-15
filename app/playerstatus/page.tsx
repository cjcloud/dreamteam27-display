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

          // Process managers data - ensure it's an array
          const managersArray = Array.isArray(managersData) ? managersData : [];
          managersArray.forEach((managerData: any, managerIndex: number) => {
            if (!managerData?.teamDetails) return;

            const teamDetailsArray = Array.isArray(managerData.teamDetails) ? managerData.teamDetails : [];
            teamDetailsArray.forEach((playerData: any) => {
              if (!playerData?.playerDetails) return;
              
              const details = playerData.playerDetails;
              const playerName = details.playerName || '';
              playerCount++;

              // Debug logging for status fields - especially for Palmer
              if (playerName.toLowerCase().includes('palmer')) {
                console.log(`🔍 PALMER COMPLETE DATA - ${playerName}:`);
                console.log('All field names:', Object.keys(details));
                console.log('Complete raw playerDetails object:', details);
                console.log('Manager data for Palmer:', managerData);
                console.log('Player data container for Palmer:', playerData);
                
                // Check every field for any injury-related content
                Object.keys(details).forEach(key => {
                  const value = details[key];
                  if (key.toLowerCase().includes('inj') || 
                      (typeof value === 'string' && value.toLowerCase().includes('inj')) ||
                      (typeof value === 'boolean' && key.toLowerCase().includes('status')) ||
                      key.toLowerCase().includes('health') ||
                      key.toLowerCase().includes('fit')) {
                    console.log(`Potential injury field - ${key}:`, value, typeof value);
                  }
                });
              }
              
              // General debug logging for any status fields
              if (details.playerinjured !== undefined || details.playerSuspended !== undefined || details.playereliminated !== undefined) {
                console.log(`Player ${playerName}:`, {
                  injured: details.playerinjured,
                  suspended: details.playerSuspended,
                  eliminated: details.playereliminated,
                  playerDNP: details.playerDNP
                });
              }

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
              // Check for injured status - comprehensive check for all possible field names and values
              const isInjured = details.playerinjured === true || details.injured === true || details.playerInjured === true ||
                               details.injury === true || details.playerInjury === true || details.isInjured === true ||
                               details.playerinjured === "true" || details.injured === "true" || details.playerInjured === "true" ||
                               details.injury === "true" || details.playerInjury === "true" || details.isInjured === "true" ||
                               details.playerinjured === 1 || details.injured === 1 || details.playerInjured === 1 ||
                               details.injury === 1 || details.playerInjury === 1 || details.isInjured === 1 ||
                               (typeof details.playerinjured === 'string' && details.playerinjured.toLowerCase().includes('inj')) ||
                               (typeof details.injured === 'string' && details.injured.toLowerCase().includes('inj')) ||
                               (typeof details.injury === 'string' && details.injury.toLowerCase().includes('inj')) ||
                               (typeof details.status === 'string' && details.status.toLowerCase().includes('inj')) ||
                               (typeof details.playerStatus === 'string' && details.playerStatus.toLowerCase().includes('inj'));
              
              if (isInjured) {
                injuredPlayersData.push(playerResult);
              }
              // Check for suspended status - try different possible field names  
              if (details.playerSuspended === true || details.suspended === true || details.playerSuspension === true) {
                suspendedPlayersData.push(playerResult);
              }
              // Check for eliminated status - try different possible field names
              if (details.playereliminated === true || details.eliminated === true || details.playerEliminated === true) {
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
          <h1 className="text-3xl font-bold mb-8">📊 Player Status Dashboard</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p>Loading player status data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">📊 Player Status Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const playedCount = allPlayers.filter((r: PlayerResult) => r.playerDNP === false).length;
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

        {/* No Status Issues Message */}
        {dnpPlayers.length === 0 && injuredPlayers.length === 0 && suspendedPlayers.length === 0 && eliminatedPlayers.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-green-800 font-semibold mb-2">✅ All Players Available</h2>
            <p className="text-green-700">
              No players have status issues. All players are available to play.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
