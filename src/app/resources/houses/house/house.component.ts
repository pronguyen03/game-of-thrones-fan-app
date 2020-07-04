import { Component, OnInit, OnDestroy } from '@angular/core';
import { House } from 'src/app/shared/models/house';
import { HouseService } from 'src/app/shared/services/house.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { CharacterService } from 'src/app/shared/services/character.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss']
})
export class HouseComponent implements OnInit, OnDestroy {
  house: House;
  id: string;
  routeSubscription: Subscription;

  constructor(
    private houseService: HouseService,
    private characterService: CharacterService,
    private helperService: HelperService,
    private location: Location,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.getHouseById(this.id);
    });
  }

  getHouseById(id: string) {
    this.house = new House();
    this.houseService.getHouseById(id)
      .subscribe(
        house => {
          this.house = Object.assign({}, this.house, house);
          if (this.house.currentLord) {
            const currentLordId = this.helperService.getIdFromURL(this.house.currentLord);
            this.characterService.getCharacterById(currentLordId).subscribe(currentLord => {
              currentLord.id = this.helperService.getIdFromURL(currentLord.url);
              this.house.currentLordDetail = currentLord;
            });
          }

          if (this.house.heir) {
            const heirId = this.helperService.getIdFromURL(this.house.heir);
            this.characterService.getCharacterById(heirId).subscribe(heir => {
              heir.id = this.helperService.getIdFromURL(heir.url);
              this.house.heirDetail = heir;
            });
          }

          if (this.house.overlord) {
            const overlordId = this.helperService.getIdFromURL(this.house.overlord);
            this.houseService.getHouseById(overlordId).subscribe(overlord => {
              overlord.id = this.helperService.getIdFromURL(overlord.url);
              this.house.overlordDetail = overlord;
            });
          }

          if (this.house.founder) {
            const founderId = this.helperService.getIdFromURL(this.house.founder);
            this.characterService.getCharacterById(founderId).subscribe(founder => {
              founder.id = this.helperService.getIdFromURL(founder.url);
              this.house.founderDetail = founder;
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
