import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { House } from '../models/house';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class HouseService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  getCharacters(): Observable<House[]> {
    return this.getData('/houses').pipe(
      map((houses: House[]) =>
      houses.map(house => {
        house.id = house.url.split('/').pop();
        return house;
      }
    ))
    );
  }

  getHouseById(id: string): Observable<House> {
    return this.getData(`/houses/${id}`);
  }
}
