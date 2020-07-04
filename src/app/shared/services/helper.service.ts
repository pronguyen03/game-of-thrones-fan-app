import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  getIdFromURL(url: string) {
    return url.split('/').pop();
  }
}
