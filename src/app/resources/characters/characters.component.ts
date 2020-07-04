import { Component, OnInit, OnDestroy } from '@angular/core';
import { Character } from 'src/app/shared/models/character';
import { Observable, Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import { CharacterService } from 'src/app/shared/services/character.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import SEARCH_CRITERIA from '../../shared/search-criteria.json';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/shared/pagination';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  headers: string[] = ['No.', 'Name', 'Gender', 'Culture', 'Born', 'Died'];
  charactersSubject: BehaviorSubject<Character[]>;
  characters$: Observable<Character[]>;

  filteredCharacters$: Observable<Character[]>;
  filterForm: FormGroup;
  filter$: Observable<{ name: string, gender: string, culture: string, born: string, died: string}>;


  searchCriteria: { display: string, value: string}[] = SEARCH_CRITERIA.CHARACTERS;
  searchQuery: { key: string, value: string } = { key: '', value: ''};
  pagination = new Pagination();

  constructor(
    private characterService: CharacterService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.charactersSubject = new BehaviorSubject<Character[]>([]);
    this.characters$ = this.charactersSubject.asObservable();
    this.initForm();

    this.routerSubscription = this.route.queryParams.subscribe(params => {
      this.pagination.currentPage = +params.page || 1;
      this.getListCharacters(this.pagination.currentPage);
    });
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      gender: [''],
      culture: [''],
      born: [''],
      died: ['']
    });

    this.filter$ = this.filterForm.valueChanges.pipe(startWith({
      name: '',
      gender: '',
      culture: '',
      born: '',
      died: ''
    })).pipe(
      debounceTime(250),
      distinctUntilChanged(),
    );

    this.filteredCharacters$ = combineLatest([this.characters$, this.filter$])
      .pipe(
        map(([characters, filterValues]) => {
          const { name, gender, culture, born, died } = filterValues;
          return characters.filter(character => {
            return (name === null || name.trim() === '' || character.name.toLowerCase().indexOf((name || '').toLowerCase()) >= 0) &&
            (gender === null || gender.trim() === '' || gender === 'All' || gender === character.gender) &&
            (culture === null || culture.trim() === '' || character.culture.toLowerCase().indexOf((culture || '').toLowerCase()) >= 0) &&
            (born === null || born.trim() === '' || character.born.toLowerCase().indexOf((born || '').toLowerCase()) >= 0) &&
            (died === null || died.trim() === '' || character.died.toLowerCase().indexOf((died || '').toLowerCase()) >= 0);
          });
        })
      );
  }

  getListCharacters(page: number): void {
    this.characterService.getCharacters(page).subscribe(characters => {
      this.charactersSubject.next(characters);
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.routerSubscription.unsubscribe();
  }

  search(searchQuery: { key: string, value: string}): void {
    this.searchQuery = searchQuery;

    this.pagination.currentPage = 1;
    this.characterService.getCharactersByQuery(this.pagination.currentPage, searchQuery).subscribe(characters => {
      this.charactersSubject.next(characters);
    });
  }

  next(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.key.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.characterService.getCharactersByQuery(++this.pagination.currentPage, this.searchQuery).subscribe(characters => {
        this.charactersSubject.next(characters);
      });

    } else {
      this.router.navigate(['/characters'], { queryParams: { page: ++this.pagination.currentPage }});
    }
  }

  previous(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.value.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.characterService.getCharactersByQuery(--this.pagination.currentPage, this.searchQuery).subscribe(characters => {
        this.charactersSubject.next(characters);
      });
    } else {
      this.router.navigate(['/characters'], { queryParams: { page: --this.pagination.currentPage }});
    }
  }

  showAll(): void {
    this.searchQuery.key = '';
    this.searchQuery.value = '';
    this.getListCharacters(this.pagination.currentPage);
  }

}
