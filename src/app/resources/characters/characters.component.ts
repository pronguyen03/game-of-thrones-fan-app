import { Component, OnInit, OnDestroy } from '@angular/core';
import { Character } from 'src/app/shared/models/character';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { CharacterService } from 'src/app/shared/services/character.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit, OnDestroy {
  headers: string[] = ['No.', 'Name', 'Gender', 'Culture', 'Born', 'Died'];
  characters$: Observable<Character[]>;
  filteredCharacters$: Observable<Character[]>;
  filterForm: FormGroup;
  filterSubscription: Subscription;

  constructor(
    private characterService: CharacterService,
    private location: Location,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.getListCharacters();
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

  getListCharacters(): void {
    this.characters$ = this.characterService.getCharacters();

    this.filteredCharacters$ = this.characters$;
  }

  back(): void {
    this.location.back();
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
    this.filterSubscription.unsubscribe();
  }

}
