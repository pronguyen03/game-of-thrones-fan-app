import { Character } from './character';

export class Book {
  url: string;
  volume: number;
  name: string;
  isbn: string;
  authors: string[];
  numberOfPages: number;
  publisher: string;
  country: string;
  mediaType: string;
  released: string;
  characters: string[];
  listCharacters: Character[] = [];
}
