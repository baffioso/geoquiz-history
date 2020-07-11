import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SummeryComponent } from './summery/summery.component';

@NgModule({
  declarations: [AppComponent, MapComponent, SummeryComponent],
  imports: [BrowserModule, MatButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
