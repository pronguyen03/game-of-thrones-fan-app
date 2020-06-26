import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  getBooks(): Observable<Book[]> {
    return this.getData('/books').pipe(
      map((books: Book[]) =>
        books.map(book => {
          book.volume = +book.url.split('/').pop();
          return book;
        }
      ))
    );
  }

  getBookByVolume(volume: number): Observable<Book> {
    return this.getData(`/books/${volume}`);
  }

  getBookByUrl(url: string): Observable<Book> {
    return this.http.get<Book>(url);
  }
}
