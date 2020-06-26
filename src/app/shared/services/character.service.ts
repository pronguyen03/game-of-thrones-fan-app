import { Injectable } from '@angular/core';
import { Character } from '../models/character';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  getCharacters(): Observable<Character[]> {
    return this.getData('/characters').pipe(
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
}
