import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() searchCriteria: { display: string, value: string}[];
  searchForm: FormGroup;
  searchSubscription: Subscription;
  @Output() searchOutput = new EventEmitter<{ key: string, value: string }>();
  @Output() getAll = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      value: [''],
      key: ['']
    });

    this.searchSubscription = this.searchForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(value => this.search(value));
  }

  search(searchQuery: { key: string, value: string}): void {
    if (!searchQuery.key || searchQuery.value.trim() === '' || !searchQuery.value || searchQuery.value.trim() === '') {
      return;
    }

    this.searchOutput.emit(searchQuery);
  }

  showAll(): void {
    this.searchForm.reset();
    this.getAll.emit(true);
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

}
