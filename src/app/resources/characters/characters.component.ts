import { Component, OnInit, OnDestroy } from '@angular/core';
import { Character } from 'src/app/shared/models/character';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { CharacterService } from 'src/app/shared/services/character.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
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
  characters$: Observable<Character[]>;
  filteredCharacters$: Observable<Character[]>;
  filterForm: FormGroup;
  filterSubscription: Subscription;

  searchCriteria: { display: string, value: string}[] = SEARCH_CRITERIA.CHARACTERS;
  searchQuery: { key: string, value: string };
  pagination = new Pagination();

  constructor(
    private characterService: CharacterService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
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

    this.filterSubscription = this.filterForm.valueChanges.subscribe(() => this.filterData());
  }

  getListCharacters(page: number): void {
    this.characters$ = this.characterService.getCharacters(page);

    this.filteredCharacters$ = this.characters$;
  }

  filterData() {
    const {
      name,
      gender,
      culture,
      born,
      died
    }: { name: string, gender: string, culture: string, born: string, died: string} = this.filterForm.value;

    this.filteredCharacters$ = this.characters$.pipe(
      map((characters: Character[]) =>
      characters.filter(character => {
          return (name === null || name.trim() === '' || character.name.toLowerCase().indexOf((name || '').toLowerCase()) >= 0) &&
            (gender === null || gender === 'All' || gender === character.gender) &&
            (culture === null || culture.trim() === '' || character.culture.toLowerCase().indexOf((culture || '').toLowerCase()) >= 0) &&
            (born === null || born.trim() === '' || character.born.toLowerCase().indexOf((born || '').toLowerCase()) >= 0) &&
            (died === null || died.trim() === '' || character.died.toLowerCase().indexOf((died || '').toLowerCase()) >= 0);
        })
      )
    );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.routerSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  search(searchQuery: { key: string, value: string}): void {
    this.searchQuery = searchQuery;

    this.pagination.currentPage = 1;
    this.characters$ = this.characterService.getCharactersByQuery(this.pagination.currentPage, searchQuery);

    this.filteredCharacters$ = this.characters$;
  }

  next(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.key.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.characters$ = this.characterService.getCharactersByQuery(++this.pagination.currentPage, this.searchQuery);

      this.filteredCharacters$ = this.characters$;
    } else {
      this.router.navigate(['/characters'], { queryParams: { page: ++this.pagination.currentPage }});
    }
  }

  previous(): void {
    if (this.searchQuery &&
      this.searchQuery.key && this.searchQuery.value.trim() !== '' &&
      this.searchQuery.value && this.searchQuery.value.trim() !== '') {
      this.characters$ = this.characterService.getCharactersByQuery(--this.pagination.currentPage, this.searchQuery);

      this.filteredCharacters$ = this.characters$;
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
