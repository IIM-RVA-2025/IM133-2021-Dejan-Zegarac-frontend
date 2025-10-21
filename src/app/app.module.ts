import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BankaComponent } from './components/banka/banka.component';
import { MaterialModule } from './material.module';
import { BankaDialogComponent } from './components/banka/banka-dialog/banka-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BankaComponent,
    BankaDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }