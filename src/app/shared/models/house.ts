import { Character } from './character';

export class House {
  id: string;
  url: string;
  name: string;
  region: string;
  coatOfArms: string;
  words: string;
  titles: string[];
  seats: string[];
  currentLord: string;
  currentLordDetail: Character;
  heir: string;
  heirDetail: Character;
  overlord: string;
  overlordDetail: House;
  founded: string;
  founder: string;
  founderDetail: Character;
  diedOut: string;
  ancestralWeapons: string[];
  cadetBranches: string[];
  swornMembers: string[];
}
