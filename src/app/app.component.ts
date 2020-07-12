import { Component, OnInit } from '@angular/core';
import { Feature } from 'geojson';

import { MapService } from './map/map.service';
import { locations } from '../assets/museer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'geoquiz';
    showLanding = true;
    randomLocations: Feature[];
    index = 0;
    buttonGuess = true;
    distance: number[] = [];
    totalDistance: number;
    showSummery = false;
    features: any;
    questionNum = 10;

    constructor(private mapService: MapService) { }

    ngOnInit(): void {
        this.features = locations.features;

        this.randomLocations = this.mapService.getRandomLocations(this.features, this.questionNum);

    }

    onClick() {
        if (this.index < this.questionNum) {
            this.buttonGuess ? this.answer() : this.nextQuestion();
        } else {
            this.handleSummery();
        }
    }

    answer() {

        // Get guess and answer coords
        const feature = this.randomLocations[this.index];
        const guessCoords = [this.mapService.currentLocation['lng'], this.mapService.currentLocation['lat']] as [number, number];
        const answerCoords = feature.geometry['coordinates'] as [number, number];

        // draw line on map and calculate distance
        const line = this.mapService.createLine(guessCoords, answerCoords);
        const dist = this.mapService.getDistance(guessCoords, answerCoords);
        this.distance.push(dist);
        this.mapService.addLineToMap(line, dist);
        this.mapService.zoomTo(line);

        // Add popup
        const name = feature.properties.name;
        const wikiId = feature.properties.wikidata;
        let html;
        if (wikiId) {
            html = `<h3>${name}</h3><a href=https://www.wikidata.org/wiki/${wikiId} target="_blank">Wikidata</a>`;
        } else {
            html = `<h3>${name}</h3>`;
        }

        this.mapService.addPopup(answerCoords, html);

        this.buttonGuess = false;

        if (this.index === this.questionNum - 1) {
            this.index = ++this.index;
        }
    }

    nextQuestion() {

        // Remove markers and line
        this.mapService.marker.remove();
        this.mapService.popup.remove();
        this.mapService.removeLine();

        // Zoom to dk
        this.mapService.flyToDK();

        this.buttonGuess = true;

        this.index = ++this.index;
    }

    handleSummery() {
        this.showSummery = true;
        this.totalDistance = this.distance.reduce((acc, cur) => acc + cur);
    }

    playAgain() {
        this.showSummery = false;
        this.index = 0;
        this.distance = [];
        this.randomLocations = this.mapService.getRandomLocations(this.features, 10);

        // Remove popup, marker and line
        this.mapService.marker.remove();
        this.mapService.popup.remove();
        this.mapService.removeLine();
        this.mapService.currentLocation = null;
        this.mapService.flyToDK();

        this.buttonGuess = true;
    }

}
