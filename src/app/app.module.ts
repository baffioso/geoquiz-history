import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SummeryComponent } from './summery/summery.component';
import { LandingComponent } from './landing/landing.component';
import { LoadingComponent } from './loading/loading.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        SummeryComponent,
        LandingComponent,
        LoadingComponent
    ],
    imports: [
        BrowserModule,
        MatButtonModule,
        MatIconModule,
        HttpClientModule,
        HttpClientJsonpModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
