'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';
import TeamModal from '@/components/ui/TeamModal';

interface Manager {
  id: string;
  currentPosition: number;
  previousPosition: number;
  name: string;
  totalPoints: number;
  teamDetails: {
    players: {
      gameWeekPoints: number;
    }[];
  };
}

interface LeagueTableProps {
  managers: Manager[];
  lastUpdated: string;
}

export default function LeagueTable({ managers, lastUpdated }: LeagueTableProps) {
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleManagerClick = (manager: Manager) => {
    setSelectedManager(manager);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedManager(null);
  };

  return (
    <div className="px-4 sm:px-2">
      <div className="max-w-[600px] mx-auto">
        <div className="overflow-hidden rounded-xl bg-[#BFE6CF] p-[3px] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]">
          <div className="relative z-10 overflow-x-auto rounded-lg">
            <div className="bg-white p-4 sm:p-6 rounded-lg max-w-[720px] mx-auto">
              <div className="bg-[#C8EAD6] rounded-lg px-4 py-2 mb-4">
                <h3 className="md:text-2xl text-xl font-bold text-[#2E3A40] text-center">League Positions</h3>
              </div>
              {lastUpdated && (
                <div className="text-sm text-[#5B6770] mb-4 text-center">
                  Last updated: {lastUpdated}
                </div>
              )}
              <table className="w-full rounded-lg table-fixed">
                <thead>
                  <tr className="text-sm text-[#2E3A40] font-medium bg-[#DCF3E6]">
                    <th className="py-3 text-center" style={{width: '15%'}}>Now</th>
                    <th className="py-3 text-center" style={{width: '15%'}}>Prev</th>
                    <th className="py-3 text-left pl-3" style={{width: '30%'}}>Manager</th>
                    <th className="py-3 text-center" style={{width: '20%'}}>Week Pts</th>
                    <th className="py-3 text-center" style={{width: '20%'}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager, index) => {
                    const positionChange = manager.previousPosition - manager.currentPosition;
                    return (
                      <tr 
                        key={manager.id}
                        className={`${
                          index % 2 === 0 ? 'bg-[#F5F6F7]' : 'bg-white'
                        } hover:bg-[#E9F5EE] transition-colors text-sm`}
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center w-8">
                              <span className="text-sm text-[#33414A] w-4 text-center">{manager.currentPosition}</span>
                              <div className="w-4 flex justify-center">
                                {positionChange !== 0 && (
                                  positionChange > 0 ? (
                                    <Image
                                      src="/images/arrowUp.svg"
                                      alt="Position improved"
                                      width={16}
                                      height={16}
                                      className="w-4 h-4"
                                      style={{ minWidth: '16px', minHeight: '16px' }}
                                    />
                                  ) : (
                                    <Image
                                      src="/images/arrowDown.svg"
                                      alt="Position dropped"
                                      width={16}
                                      height={16}
                                      className="w-4 h-4"
                                      style={{ minWidth: '16px', minHeight: '16px' }}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center text-sm text-[#33414A]">{manager.previousPosition}</td>
                        <td className="px-3 py-3 text-[#33414A] font-medium" style={{fontSize: '15px'}}>
                          <button
                            onClick={() => handleManagerClick(manager)}
                            className="text-left hover:text-[#1B7F4B] hover:underline transition-colors cursor-pointer"
                          >
                            {manager.name}
                          </button>
                        </td>
                        <td className="px-3 py-3 text-center text-sm text-[#33414A] font-bold">
                          {manager.teamDetails.players.reduce((total, player) => total + player.gameWeekPoints, 0)}
                        </td>
                        <td className="px-3 py-3 text-center text-base text-[#2E3A40] font-bold">
                          {manager.totalPoints}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Modal */}
      <TeamModal 
        manager={selectedManager}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}