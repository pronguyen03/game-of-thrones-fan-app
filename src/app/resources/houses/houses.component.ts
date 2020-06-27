import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { House } from 'src/app/shared/models/house';
import { map } from 'rxjs/operators';
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
  houses$: Observable<House[]>;
  filteredHouses$: Observable<House[]>;
  filterForm: FormGroup;
  filterSubscription: Subscription;

  searchCriteria: { display: string, value: string}[] = SEARCH_CRITERIA.HOUSES;
  searchQuery: { key: string, value: string };
  pagination = new Pagination();

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private houseService: HouseService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
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

    this.filterSubscription = this.filterForm.valueChanges.subscribe(() => this.filterData());
  }

  getListHouses(page: number): void {
    this.houses$ = this.houseService.getHouses(page);

    this.filteredHouses$ = this.houses$;
  }

  back(): void {
    this.location.back();
  }

  filterData() {
    const {
      name,
      region,
      words,
    }: { name: string, region: string, words: string } = this.filterForm.value;

    this.filteredHouses$ = this.houses$.pipe(
      map((characters: House[]) =>
      characters.filter(character => {
          return (name === null || name.trim() === '' || character.name.toLowerCase().indexOf((name || '').toLowerCase()) >= 0) &&
          (region === null || region.trim() === '' || character.region.toLowerCase().indexOf((region || '').toLowerCase()) >= 0) &&
          (words === null || words.trim() === '' || character.words.toLowerCase().indexOf((words || '').toLowerCase()) >= 0);
        })
      )
    );
  }

  search(searchQuery: { key: string, value: string}): void {
    this.searchQuery = searchQuery;

    this.pagination.currentPage = 1;
    this.houses$ = this.houseService.getHousesByQuery(this.pagination.currentPage, searchQuery);

    this.filteredHouses$ = this.houses$;
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
      this.houses$ = this.houseService.getHousesByQuery(++this.pagination.currentPage, this.searchQuery);

      this.filteredHouses$ = this.houses$;
    } else {
      this.router.navigate(['/houses'], { queryParams: { page: ++this.pagination.currentPage }});
    }
  }

  previous(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.key.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.houses$ = this.houseService.getHousesByQuery(--this.pagination.currentPage, this.searchQuery);

      this.filteredHouses$ = this.houses$;
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
