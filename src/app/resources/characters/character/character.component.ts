import { Component, OnInit, OnDestroy } from '@angular/core';
import { Character } from 'src/app/shared/models/character';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { CharacterService } from 'src/app/shared/services/character.service';
import { Subscription } from 'rxjs';
import { Utils } from 'src/app/shared/utils/utils';
import { HelperService } from 'src/app/shared/services/helper.service';
import { BookService } from 'src/app/shared/services/book.service';
import { HouseService } from 'src/app/shared/services/house.service';

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
    private bookService: BookService,
    private houseService: HouseService,
    private route: ActivatedRoute,
    private location: Location,
    private helperService: HelperService

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
        character => {
          this.character = Object.assign({}, this.character, character);

          this.character.books.forEach(bookURL => {
            const bookId = this.helperService.getIdFromURL(bookURL);
            this.bookService.getBookByVolume(+bookId).subscribe(book => {
              book.volume = +this.helperService.getIdFromURL(book.url);
              this.character.listBooks.push(book);
            });
          });

          this.character.allegiances.forEach(houseURL => {
            const houseId = this.helperService.getIdFromURL(houseURL);
            this.houseService.getHouseById(houseId).subscribe(house => {
              house.id = this.helperService.getIdFromURL(house.url);
              this.character.listAllegiances.push(house);
            });
          });

          if (this.character.spouse) {
            const spouseId = this.helperService.getIdFromURL(this.character.spouse);
            this.characterService.getCharacterById(spouseId).subscribe(spouse => {
              this.character.spouseDetail = spouse;
              this.character.spouseDetail.id = this.helperService.getIdFromURL(spouse.url);
            });
          }

          if (this.character.father) {
            const fatherId = this.helperService.getIdFromURL(this.character.father);
            this.characterService.getCharacterById(fatherId).subscribe(father => {
              this.character.fatherDetail = father;
              this.character.fatherDetail.id = this.helperService.getIdFromURL(father.url);
            });
          }

          if (this.character.mother) {
            const motherId = this.helperService.getIdFromURL(this.character.mother);
            this.characterService.getCharacterById(motherId).subscribe(mother => {
              this.character.motherDetail = mother;
              this.character.motherDetail.id = this.helperService.getIdFromURL(mother.url);
            });
          }
        },
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
