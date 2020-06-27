import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterButtonsComponent } from './components/footer-buttons/footer-buttons.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';


@NgModule({
  declarations: [SearchBarComponent, FooterButtonsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    SearchBarComponent,
    FooterButtonsComponent
  ]
})
export class SharedModule { }
