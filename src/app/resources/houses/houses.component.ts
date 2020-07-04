import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { House } from 'src/app/shared/models/house';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HouseService } from 'src/app/shared/services/house.service';
import SEARCH_CRITERIA from '../../shared/search-criteria.json';
import { Pagination } from 'src/app/shared/pagination';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.scss']
})
export class HousesComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  headers: string[] = ['No.', 'Name', 'Region', 'Words'];
  housesSubject: BehaviorSubject<House[]>;
  houses$: Observable<House[]>;

  filteredHouses$: Observable<House[]>;
  filterForm: FormGroup;
  filter$: Observable<{ name: string, region: string, words: string }>;

  searchCriteria: { display: string, value: string}[] = SEARCH_CRITERIA.HOUSES;
  searchQuery: { key: string, value: string } = { key: '', value: ''};
  pagination = new Pagination();

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private houseService: HouseService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.housesSubject = new BehaviorSubject<House[]>([]);
    this.houses$ = this.housesSubject.asObservable();
    this.initForm();

    this.routerSubscription = this.route.queryParams.subscribe(params => {
      this.pagination.currentPage = +params.page || 1;
      this.getListHouses(this.pagination.currentPage);
    });
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      region: [''],
      words: [''],
    });

    this.filter$ = this.filterForm.valueChanges.pipe(startWith({
      name: '',
      region: '',
      words: ''
    })).pipe(
      debounceTime(250),
      distinctUntilChanged(),
    );

    this.filteredHouses$ = combineLatest([this.houses$, this.filter$])
    .pipe(
      map(([houses, filterValues]) => {
        const { name, region, words } = filterValues;
        return houses.filter(character => {
          return (name === null || name.trim() === '' || character.name.toLowerCase().indexOf((name || '').toLowerCase()) >= 0) &&
          (region === null || region.trim() === '' || character.region.toLowerCase().indexOf((region || '').toLowerCase()) >= 0) &&
          (words === null || words.trim() === '' || character.words.toLowerCase().indexOf((words || '').toLowerCase()) >= 0);
        });
      })
    );
  }

  getListHouses(page: number): void {
    this.houseService.getHouses(page).subscribe(houses => {
      this.housesSubject.next(houses);
    });
  }

  back(): void {
    this.location.back();
  }

  search(searchQuery: { key: string, value: string}): void {
    this.searchQuery = searchQuery;

    this.pagination.currentPage = 1;
    this.houseService.getHousesByQuery(this.pagination.currentPage, searchQuery).subscribe(houses => {
      this.housesSubject.next(houses);
    });

  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.routerSubscription.unsubscribe();
  }

  next(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.key.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.houseService.getHousesByQuery(++this.pagination.currentPage, this.searchQuery).subscribe(houses => {
        this.housesSubject.next(houses);
      });
    } else {
      this.router.navigate(['/houses'], { queryParams: { page: ++this.pagination.currentPage }});
    }
  }

  previous(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.key.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.houseService.getHousesByQuery(--this.pagination.currentPage, this.searchQuery).subscribe(houses => {
        this.housesSubject.next(houses);
      });
    } else {
      this.router.navigate(['/houses'], { queryParams: { page: --this.pagination.currentPage }});
    }
  }

  showAll(): void {
    this.searchQuery.key = '';
    this.searchQuery.value = '';
    this.getListHouses(this.pagination.currentPage);
  }
}
