import { House } from './house';
import { Book } from './book';

export class Character {
  id: string;
  url: string;
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  fatherDetail: Character;
  mother: string;
  motherDetail: Character;
  spouse: string;
  spouseDetail: Character;
  allegiances: string[] = [];
  listAllegiances: House[] = [];
  books: string[] = [];
  listBooks: Book[] = [];
  tvSeries: string[] = [];
  playedBy: string[] = [];
}
