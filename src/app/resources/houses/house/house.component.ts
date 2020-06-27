import { Component, OnInit, OnDestroy } from '@angular/core';
import { House } from 'src/app/shared/models/house';
import { HouseService } from 'src/app/shared/services/house.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

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
        house => this.house = house,
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
