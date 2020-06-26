import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/shared/models/character';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { CharacterService } from 'src/app/shared/services/character.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  character: Character;
  id: string;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private location: Location

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.getCharacterById(this.id);
    });
  }

  getCharacterById(id: string) {
    this.character = new Character();
    this.characterService.getCharacterById(id)
      .subscribe(
        character => this.character = character,
        error => console.error(error));
  }

  back(): void {
    this.location.back();
  }

}
