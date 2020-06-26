import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { House } from 'src/app/shared/models/house';
import { map } from 'rxjs/operators';
import { HouseService } from 'src/app/shared/services/house.service';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.scss']
})
export class HousesComponent implements OnInit {
  headers: string[] = ['No.', 'Name', 'Region', 'Words'];
  houses$: Observable<House[]>;
  filteredHouses$: Observable<House[]>;
  filterForm: FormGroup;
  filterSubscription: Subscription;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private houseService: HouseService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getListHouses();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      region: [''],
      words: [''],
    });

    this.filterSubscription = this.filterForm.valueChanges.subscribe(() => this.filterData());
  }

  getListHouses(): void {
    this.houses$ = this.houseService.getCharacters();

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
}
