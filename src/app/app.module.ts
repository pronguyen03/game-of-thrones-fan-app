import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule} from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';
import { AuthenticationService } from './shared/services/authentication.service';
import { BooksComponent } from './resources/books/books.component';
import { HttpClientModule } from '@angular/common/http';
import { BookComponent } from './resources/books/book/book.component';
import { CharactersComponent } from './resources/characters/characters.component';
import { HousesComponent } from './resources/houses/houses.component';
import { HouseComponent } from './resources/houses/house/house.component';
import { CharacterComponent } from './resources/characters/character/character.component';
import { SharedModule } from './shared/shared.module';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    BooksComponent,
    BookComponent,
    CharactersComponent,
    HousesComponent,
    CharacterComponent,
    HouseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
