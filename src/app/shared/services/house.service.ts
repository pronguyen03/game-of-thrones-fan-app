import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { House } from '../models/house';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class HouseService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  getHouses(page: number): Observable<House[]> {
    return of(`/houses?page=${page}`)
      .pipe(
        switchMap(url => this.getData(url))
      ).pipe(
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

  getHousesByQuery(page: number, query: { key: string, value: string}): Observable<House[]> {
    return of(`/houses?page=${page}&${query.key}=${query.value}`)
      .pipe(
        switchMap(url => this.getData(url))
      ).pipe(
        map((houses: House[]) =>
        houses.map(house => {
          house.id = house.url.split('/').pop();
          return house;
          }
        ))
      );
  }
}
