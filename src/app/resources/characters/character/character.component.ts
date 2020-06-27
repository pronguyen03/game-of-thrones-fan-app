import { Component, OnInit, OnDestroy } from '@angular/core';
import { Character } from 'src/app/shared/models/character';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { CharacterService } from 'src/app/shared/services/character.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit, OnDestroy {
  character: Character;
  id: string;
  routeSubscription: Subscription;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private location: Location

  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.getCharacterById(this.id);
    });
  }

  getCharacterById(id: string) {
    this.character = new Character();
    this.characterService.getCharacterById(id)
      .subscribe(
        character => this.character = character,
        error => alert(error));
  }

  back(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.routeSubscription.unsubscribe();
  }

}
