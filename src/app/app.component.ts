import { Component, OnInit } from '@angular/core';
import { Feature } from 'geojson';

import { MapService } from './map/map.service';
import { battle } from '../assets/battle';
import { Loading, Category } from './interfaces';
import { WikipediaService } from './wikipedia.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'geoquiz';
    showLanding = true;
    showLoading = false;
    showSummery = false;
    randomLocations: Feature[];
    index = 0;
    buttonGuess = true;
    distance: number[] = [];
    totalDistance: number;
    features: any;
    questionNum = 10;
    categories = [
        { name: 'Battle', id: 'battle', icon: 'museum' },
    ];
    selectedCategory: string;
    loadingData: Loading;

    constructor(private mapService: MapService) {
    }

    ngOnInit(): void {
        // this.wikiService.getExcerpt('stack_overflow').subscribe()
    }

    onClick() {
        if (this.index < this.questionNum) {
            this.buttonGuess ? this.answer() : this.nextQuestion();
        } else {
            this.handleSummery();
        }
    }

    selectCategory(id: string) {
        this.showLanding = false;
        this.showLoading = true;

        // remove loading after 2 sec
        setTimeout(() => {
            this.showLoading = false;
        }, 2000);

        switch (id) {
            case 'battle':
                this.features = battle.features;
                this.selectedCategory = id;
                break;
            default:
                break;
        }

        this.loadingData = {
            category: this.getCategoryFromId(id).name,
            questionNum: this.questionNum,
            featureCount: this.features.length
        };

        // raing 1 is easy 0 is hard
        const easy = this.mapService.getRandomLocations(
            this.features.filter(x => x['properties']['rating'] === 1),
            Math.round(this.questionNum / 2)
        );
        const hard = this.mapService.getRandomLocations(
            this.features.filter(x => x['properties']['rating'] === 0),
            Math.round(this.questionNum / 2)
        );

        // combine and shuffle
        this.randomLocations = easy.concat(hard).sort(() => Math.random() - 0.5);
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
        const wd = feature.properties.wikidata;
        const wp = feature.properties.wikipedia;

        // Logic for popup html choos
        let html: string;
        if (wp && wp.length > 0) {
            // tslint:disable-next-line:max-line-length
            html = `<h3>${name}</h3><a href=${wp} target="_blank">Wikipedia</a>`;
        } else if (wd) {
            html = `<h3>${name}</h3><a href=${wd} target="_blank">Wikidata</a>`;
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
        this.totalDistance = Math.round(this.distance.reduce((acc, cur) => acc + cur));
    }

    playAgain() {
        this.index = 0;
        this.distance = [];

        // Remove popup, marker and line
        this.mapService.marker.remove();
        this.mapService.popup.remove();
        this.mapService.removeLine();
        this.mapService.currentLocation = null;
        this.mapService.flyToDK();

        this.buttonGuess = true;
        this.showSummery = false;
        this.showLanding = true;
    }

    getCategoryFromId(id: string): Category {
        return this.categories.find(x => x.id === id);
    }

}
