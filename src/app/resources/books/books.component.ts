import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book';
import { BookService } from 'src/app/shared/services/book.service';
import { Location } from '@angular/common';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnDestroy {
  headers: string[] = ['Volume', 'Name', 'Authors', 'Released Date'];
  books$: Observable<Book[]>;
  filteredBook$: Observable<Book[]>;
  filterForm: FormGroup;
  filterSubscription: Subscription;
  constructor(
    private bookService: BookService,
    private location: Location,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.getListBooks();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      fromDate: [''],
      toDate: ['']
    });

    this.filterSubscription = this.filterForm.valueChanges.subscribe(() => this.filterData());
  }

  getListBooks(): void {
    this.books$ = this.bookService.getBooks();

    this.filteredBook$ = this.books$;
  }

  back(): void {
    this.location.back();
  }

  filterData() {
    const { name, fromDate, toDate }: { name: string, fromDate: string, toDate: string} = this.filterForm.value;

    this.filteredBook$ = this.books$.pipe(
      map((books: Book[]) =>
        books.filter(book => {
          return (name === null || name.trim() === '' || book.name.toLowerCase().indexOf((name || '').toLowerCase()) >= 0) &&
            (fromDate === null || fromDate.trim() === '' || moment(book.released) >= moment(fromDate)) &&
            (toDate === null || toDate.trim() === '' || moment(book.released) <= moment(toDate));
        })
      )
    );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.filterSubscription.unsubscribe();
  }
}
