'use client';

import { Manager, Player } from '@/types';

interface TeamCardProps {
  manager: Manager;
}

const PlayerStatus = ({ player }: { player: Player }) => {
  if (player.eliminated) {
    return (
      <div className="w-3 h-3 mr-2 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#ef4444" />
          <path d="M30 30 L70 70 M70 30 L30 70" stroke="white" strokeWidth="12" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (player.injured) {
    return (
      <div className="w-3 h-3 mr-2 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="white" />
          <rect x="25" y="42" width="50" height="16" fill="#ef4444" />
          <rect x="42" y="25" width="16" height="50" fill="#ef4444" />
          <circle cx="50" cy="50" r="50" fill="none" stroke="#ef4444" strokeWidth="4" />
        </svg>
      </div>
    );
  }
  
  if (player.suspended) {
    return (
      <div className="w-2 h-2 mr-2 rounded bg-gradient-to-br from-red-500 to-yellow-500" />
    );
  }
  
  return (
    <div 
      className={`w-2 h-2 mr-2 rounded-full ${
        player.isActive ? 'bg-green-500' : 'bg-red-500'
      }`}
    />
  );
};



export default function TeamCard({ manager }: TeamCardProps) {
  const positionChange = manager.previousPosition - manager.currentPosition;
  const weekPoints = manager.teamDetails.players.reduce((total, player) => total + player.gameWeekPoints, 0);
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-[3px] border-[#BFE6CF]">
      <div className="flex justify-between items-center bg-[#C8EAD6] rounded-lg px-4 py-2">
        <h3 className="text-2xl font-bold text-[#2E3A40]">{manager.name}</h3>
        <div className="flex items-center gap-1">
          <span className="pr-4 text-sm text-[#2E3A40]">Current Position:</span>
          <span className="inline-flex items-center justify-center bg-munsell font-bold text-tangerine rounded-full w-6 h-6">
            {manager.currentPosition}
          </span>
        </div>
      </div>
      <div className="space-y-1 mt-4">
        <div className="flex items-center justify-between text-xs text-[#2E3A40] font-medium px-2 py-1 bg-[#DCF3E6] rounded">
          <div className="flex-1">Name</div>
          <div className="flex gap-4 text-right">
            <div className="w-16">GameWeek Pts</div>
            <div className="w-12">Total</div>
          </div>
        </div>
        {manager.teamDetails.players.map((player, index) => (
          <div 
            key={player.id} 
            className={`rounded-lg ${
              index % 2 === 0 ? 'bg-[#F5F6F7]' : 'bg-white'
            }`}
          >
            <div className="px-2 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <PlayerStatus player={player} />
                  <span className={`text-sm text-[#33414A] font-semibold ${player.eliminated ? 'text-[#9AA4AC]' : ''}`}>{player.name}</span>
                </div>
                <div className="flex gap-4 text-right">
                  <div className="w-16 text-sm text-[#33414A] font-medium">{player.gameWeekPoints}</div>
                  <div className="w-12 text-sm text-[#33414A] font-medium">{player.points}</div>
                </div>
              </div>
              <div className="ml-4 text-[11px] text-[#5B6770]">
                {player.eliminated ? (
                  "No longer in Prem"
                ) : (
                  `${player.club} ${player.position}`
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-[#C8EAD6] rounded-lg px-4 py-2 mt-4">
        <div className="text-center">
          <div className="text-xs text-[#5B6770]">Points this week</div>
          <div className="text-md font-bold text-[#2E3A40]">{weekPoints}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[#5B6770]">Total Points</div>
          <div className="text-md font-bold text-[#2E3A40]">{manager.totalPoints}</div>
        </div>
      </div>
    </div>
  );
}