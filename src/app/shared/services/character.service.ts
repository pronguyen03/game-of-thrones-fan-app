import { Injectable } from '@angular/core';
import { Character } from '../models/character';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  getCharacters(page: number): Observable<Character[]> {
    return of(`/characters?page=${page}`)
      .pipe(
        switchMap(url => this.getData(url))
      ).pipe(
        map((characters: Character[]) =>
          characters.map(character => {
            character.id = character.url.split('/').pop();
            return character;
          }
      ))
    );
  }

  getCharacterById(id: string): Observable<Character> {
    return this.getData(`/characters/${id}`);
  }

  getCharactersByQuery(page: number, query: { key: string, value: string}): Observable<Character[]> {
    return of(`/characters?page=${page}&${query.key}=${query.value}`)
      .pipe(
        switchMap(url => this.getData(url))
      ).pipe(
        map((characters: Character[]) =>
          characters.map(character => {
            character.id = character.url.split('/').pop();
            return character;
          }
        ))
      );
  }
}
