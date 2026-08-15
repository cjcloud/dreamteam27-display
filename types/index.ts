export type Club =
  | 'SPURS'
  | 'FOR'
  | 'ARS'
  | 'CHE'
  | 'MAN U'
  | 'LIV'
  | 'MAN C'
  | 'VILLA'
  | 'NEW'
  | 'BRI'
  | 'BRE'
  | 'PAL'
  | 'LEE'
  | 'BOU'
  | 'SUN'
  | 'EVE'
  | 'FUL'
  | 'WHAM'
  | 'WOL'
  | 'BUR'
  | 'COV'
  | 'HUL'
  | 'IPS'
  | 'Unknown';

export type Position = 'GK' | 'DEF' | 'MID' | 'STR' | 'Unknown';

export interface PlayerData {
  name: string;
  club: Club;
  position: Position;
  suspended: boolean;
  eliminated: boolean;
  injured: boolean;
  gwpts: number;
  gameWeekTotalPoints: number;
}

export interface Player {
  id: string;
  name: string;
  club: Club;
  position: Position;
  points: number;
  gameWeekPoints: number;
  isActive: boolean;
  suspended: boolean;
  injured: boolean;
  eliminated: boolean;
}

export interface Manager {
  id: string;
  name: string;
  currentPosition: number;
  previousPosition: number;
  totalPoints: number;
  teamDetails: {
    players: Player[];
  };
}

export interface ManagersData {
  managers: Manager[];
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
}