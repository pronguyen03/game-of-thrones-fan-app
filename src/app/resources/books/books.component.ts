import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book';
import { BookService } from 'src/app/shared/services/book.service';
import { Location } from '@angular/common';
import { map, debounceTime, distinctUntilChanged, switchMap, throttleTime } from 'rxjs/operators';
import moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import SEARCH_CRITERIA from '../../shared/search-criteria.json';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/shared/pagination';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  headers: string[] = ['Volume', 'Name', 'Authors', 'Released Date'];
  books$: Observable<Book[]>;
  filteredBook$: Observable<Book[]>;
  filterForm: FormGroup;
  filterSubscription: Subscription;

  searchCriteria: { display: string, value: string}[] = SEARCH_CRITERIA.BOOKS;
  searchQuery: { key: string, value: string };
  pagination = new Pagination();

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.initForm();

    this.routerSubscription = this.route.queryParams.subscribe(params => {
      this.pagination.currentPage = +params.page || 1;
      this.getListBooks(this.pagination.currentPage);
    });
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      fromDate: [''],
      toDate: ['']
    });

    this.filterSubscription = this.filterForm.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    ).subscribe(() => this.filterData());
  }

  getListBooks(page: number): void {
    this.books$ = this.bookService.getBooks(page);

    this.filteredBook$ = this.books$;
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

  search(searchQuery: { key: string, value: string}): void {
    this.searchQuery = searchQuery;
    this.pagination.currentPage = 1;

    this.books$ = this.bookService.getBooksByQuery(this.pagination.currentPage, searchQuery);

    this.filteredBook$ = this.books$;
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.filterSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  next(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.key.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.books$ = this.bookService.getBooksByQuery(++this.pagination.currentPage, this.searchQuery);

      this.filteredBook$ = this.books$;
    } else {
      this.router.navigate(['/books'], { queryParams: { page: ++this.pagination.currentPage }});
    }
  }

  previous(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.key.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.books$ = this.bookService.getBooksByQuery(--this.pagination.currentPage, this.searchQuery);

      this.filteredBook$ = this.books$;
    } else {
      this.router.navigate(['/books'], { queryParams: { page: --this.pagination.currentPage }});
    }
  }

  showAll(): void {
    this.searchQuery.key = '';
    this.searchQuery.value = '';
    this.getListBooks(this.pagination.currentPage);
  }
}
