import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BookService } from 'src/app/shared/services/book.service';
import { Book } from 'src/app/shared/models/book';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  book: Book;
  volume: number;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.volume = +(params.volume);
      this.getBookByVolume(this.volume);
    });
  }

  getBookByVolume(volume: number) {
    this.book = new Book();
    this.bookService.getBookByVolume(volume)
      .subscribe(
        book => this.book = book,
        error => alert(error));
  }

  back(): void {
    this.location.back();
  }

}
