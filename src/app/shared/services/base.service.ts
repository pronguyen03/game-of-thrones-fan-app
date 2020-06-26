import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  ROOT_API = 'https://www.anapioficeandfire.com/api';

  constructor(public http: HttpClient) { }

  getData(url: string): Observable<any> {
    return this.http.get(this.ROOT_API + url);
  }
}
