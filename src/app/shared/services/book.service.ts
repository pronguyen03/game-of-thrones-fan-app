import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Book } from '../models/book';
import { catchError, map, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  getBooks(page: number): Observable<Book[]> {
    return of(`/books?page=${page}`)
      .pipe(
        switchMap(url => this.getData(url))
      ).pipe(
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

  getBooksByQuery(page: number, query: { key: string, value: string}): Observable<Book[]> {
    return of(`/books?page=${page}&${query.key}=${query.value}`)
      .pipe(
        switchMap(url => this.getData(url))
      ).pipe(
        map((books: Book[]) =>
          books.map(book => {
            book.volume = +book.url.split('/').pop();
            return book;
          })
        ),
        catchError(value => tap(value))
      );
  }
}
