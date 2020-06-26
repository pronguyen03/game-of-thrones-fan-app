import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { AuthGuard } from './shared/auth.guard';
import { BooksComponent } from './resources/books/books.component';
import { BookComponent } from './resources/books/book/book.component';
import { CharactersComponent } from './resources/characters/characters.component';
import { HousesComponent } from './resources/houses/houses.component';
import { CharacterComponent } from './resources/characters/character/character.component';
import { HouseComponent } from './resources/houses/house/house.component';


const routes: Routes = [
  { path: '', component: OverviewComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard] },
  { path: 'books', component: BooksComponent , canActivate: [AuthGuard]},
  { path: 'books/:volume', component: BookComponent , canActivate: [AuthGuard]},
  { path: 'characters', component: CharactersComponent , canActivate: [AuthGuard]},
  { path: 'characters/:id', component: CharacterComponent , canActivate: [AuthGuard]},
  { path: 'houses', component: HousesComponent , canActivate: [AuthGuard]},
  { path: 'houses/:id', component: HouseComponent , canActivate: [AuthGuard]},
  // { path: 'login', component: LoginComponent },
  // { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
