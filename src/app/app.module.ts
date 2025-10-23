import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'; 
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BankaComponent } from './components/banka/banka.component';
import { MaterialModule } from './material.module';
import { BankaDialogComponent } from './components/banka/banka-dialog/banka-dialog.component';
import { KorisnikUslugeComponent } from './components/korisnik-usluge/korisnik-usluge.component';
import { KorisnikUslugeDialogComponent } from './components/korisnik-usluge/korisnik-usluge-dialog/korisnik-usluge-dialog.component';
import { FilijalaComponent } from './components/filijala/filijala.component';
import { FilijalaDialogComponent } from './components/filijala/filijala-dialog/filijala-dialog.component';
import { UslugaComponent } from './components/usluga/usluga.component';
import { UslugaDialogComponent } from './components/usluga/usluga-dialog/usluga-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'banka', component: BankaComponent },
  { path: 'filijala', component: FilijalaComponent },
  { path: 'korisnik', component: KorisnikUslugeComponent },
  { path: 'usluga', component: UslugaComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    BankaComponent,
    BankaDialogComponent,
    KorisnikUslugeComponent,
    KorisnikUslugeDialogComponent,
    FilijalaComponent,
    FilijalaDialogComponent,
    UslugaComponent,
    UslugaDialogComponent,
    HomeComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }