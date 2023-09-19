import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgramSearchComponent } from './program-search/program-search.component';
import { ProgramDashboardComponent } from './program-dashboard/program-dashboard.component';

import {AutoCompleteModule} from 'primeng/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    ProgramSearchComponent,
    ProgramDashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
