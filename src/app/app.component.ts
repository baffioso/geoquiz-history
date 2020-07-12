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

        const guess = [this.mapService.currentLocation['lng'], this.mapService.currentLocation['lat']] as [number, number];
        const answer = this.randomLocations[this.index].geometry['coordinates'] as [number, number];

        const line = this.mapService.createLine(guess, answer);
        const dist = this.mapService.getDistance(guess, answer);
        this.distance.push(dist);
        this.mapService.addLineToMap(line, dist);
        this.mapService.zoomTo(line);

        this.buttonGuess = false;

        if (this.index === this.questionNum - 1) {
            this.index = ++this.index;
        }
    }

    nextQuestion() {

        // Remove markers and line
        this.mapService.marker.remove();
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
        this.totalDistance = 0;
        this.randomLocations = this.mapService.getRandomLocations(this.features, 10);

        // Remove markers and line
        this.mapService.marker.remove();
        this.mapService.removeLine();
        this.mapService.currentLocation = null;
        this.mapService.flyToDK();

        this.buttonGuess = true;
    }

}
