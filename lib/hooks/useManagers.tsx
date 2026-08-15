'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { Manager, Player, PlayerData, Club, Position } from '@/types';

const defaultPlayerInfo: PlayerData = {
  name: '',
  club: 'Unknown',
  position: 'Unknown',
  suspended: false,
  eliminated: false,
  injured: false,
  gwpts: 0,
  gameWeekTotalPoints: 0
};

// Helper function to ensure club is a valid Club type
const validateClub = (club: string | undefined): Club => {
  const validClubs: Club[] = [
    'SPURS', 'FOR', 'ARS', 'CHE', 'MAN U', 'LIV', 'MAN C',
    'VILLA', 'NEW', 'BRI', 'BRE', 'PAL', 'LEE', 'BOU',
    'SUN', 'EVE', 'FUL', 'WHAM', 'WOL', 'BUR',
    'COV', 'HUL', 'IPS', 'Unknown'
  ];
  
  // Handle LEEDS -> LEE mapping
  if (club === 'LEEDS') {
    return 'LEE';
  }
  
  return validClubs.includes(club as Club) ? (club as Club) : 'Unknown';
};

// Helper function to ensure position is a valid Position type
const validatePosition = (position: string | undefined): Position => {
  const validPositions: Position[] = ['GK', 'DEF', 'MID', 'STR', 'Unknown'];
  return validPositions.includes(position as Position) ? (position as Position) : 'Unknown';
};

export function useManagers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Firebase listeners...');
    
    // Listen to managers data
    const managersRef = ref(db, '/0');
    const lastUpdatedRef = ref(db, '/2/0');
  
    console.log('lastUpdatedRef:', lastUpdatedRef);
    
    // Subscribe to managers
    const unsubscribeManagers = onValue(
      managersRef,
      (snapshot) => {
        try {
          const managersData = snapshot.val();
          console.log('Raw managers data:', managersData);
          
          if (!managersData) {
            console.log('No managers data in database');
            setManagers([]);
            return;
          }

          // Convert array of managers to array of processed managers
          const managersArray = managersData.map((managerData: any, index: number) => {
            console.log(`Processing manager ${index}:`, managerData);

            // Process team details
            const team: Player[] = (managerData.teamDetails || []).map((playerData: any) => {
              const details = playerData.playerDetails || {};
              // Check player status
              const isInjured = details.playerinjured || false;
              const isSuspended = details.playerSuspended || false;
              const isEliminated = details.playereliminated || false;
              const playerDNP = details.playerDNP;
              console.log('playerDNP:', playerDNP);
              return {
                id: playerData.playerId,
                name: details.playerName || `Player ${playerData.playerId}`,
                club: validateClub(details.playerClub),
                position: validatePosition(details.playerPosition),
                points: details.gwtotalPts || 0, // Player's total accumulated points for the season
                gameWeekPoints: details.gwpts ?? 0, // Player's points for the current gameweek
                isActive: !(isInjured || isSuspended || isEliminated || playerDNP),
                injured: isInjured,
                suspended: isSuspended,
                eliminated: isEliminated
              };
            });


            // Calculate total points and week points by summing player points
            const totalPoints = team.reduce((sum: number, player: Player) => sum + player.points, 0);
            const weekPoints = team.reduce((sum: number, player: Player) => sum + player.gameWeekPoints, 0);

            return {
              id: managerData.managerId?.toString() || index.toString(),
              name: managerData.manager || 'Unknown Manager',
              currentPosition: managerData.posNow || 0,
              previousPosition: managerData.posLast || 0,
              totalPoints, // Calculated from player points
              weekPoints,  // Calculated from player points
              teamDetails: {
                players: team
              }
            };
          });

          console.log('Processed managers:', managersArray);

          // Sort by total points in descending order
          managersArray.sort((a: Manager, b: Manager) => b.totalPoints - a.totalPoints);
          
          // Update positions based on sort order
          managersArray.forEach((manager: Manager, index: number) => {
            manager.currentPosition = index + 1;
          });

          setManagers(managersArray);
        } catch (err) {
          console.error('Error processing managers data:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch managers'));
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firebase managers error:', error);
        setError(error);
        setLoading(false);
      }
    );

    // Subscribe to lastUpdated
    const unsubscribeLastUpdated = onValue(
      lastUpdatedRef,
      (snapshot) => {
        try {
          const dateStr = snapshot.val();
          console.log('Last updated date string:', dateStr);
          if (dateStr) {
            setLastUpdated(dateStr);
          } else {
            console.log('No last updated time found');
            setLastUpdated(null);
          }
        } catch (err) {
          console.error('Error processing last updated:', err);
          setLastUpdated(null);
        }
      },
      (error) => {
        console.error('Firebase last updated error:', error);
        setLastUpdated(null);
      }
    );

    return () => {
      console.log('Cleaning up Firebase listeners...');
      unsubscribeManagers();
      unsubscribeLastUpdated();
    };
  }, []);

  return { managers, loading, error, lastUpdated };
}
