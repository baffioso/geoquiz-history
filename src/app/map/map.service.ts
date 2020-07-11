import { Injectable } from '@angular/core';
import { Map, Marker, NavigationControl, LngLatLike, GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';
import bbox from '@turf/bbox';
import distance from '@turf/distance';
import { environment } from '../../environments/environment';
import { Feature } from 'geojson';


@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;
    style = 'mapbox://styles/baffioso/ckch86rut1u3k1im4lyfti1l8';
    center = [11, 55.5];
    zoom = 5;
    marker = new Marker();
    currentLocation: LngLatLike;

    createMap() {
        this.map = new Map({
            container: 'map',
            style: this.style,
            center: this.center as LngLatLike,
            zoom: this.zoom,
            accessToken: environment.mapboxToken,
        });

        this.map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');

        this.map.on('load', () => {
            this.addBehavior();
        });
    }

    addBehavior() {

        this.map.on('click', (e) => {
            this.currentLocation = e.lngLat;

            this.marker
                .setLngLat(e.lngLat)
                .addTo(this.map);

            // console.log(this.marker);
        });
    }

    getRandomLocations(features: any, n: number) {
        const result = new Array(n);
        let len = features.length;
        const taken = new Array(len);

        if (n > len) {
            throw new RangeError('getRandomLocations: more elements taken than available');
        }
        while (n--) {
            const x = Math.floor(Math.random() * len);
            result[n] = features[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    createLine(point1: [number, number], point2: [number, number]) {
        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [point1, point2]
            }
        };
    }

    addLineToMap(line: any) {
        if (this.map.getLayer('line')) {
            (this.map.getSource('line') as GeoJSONSource).setData(line);
        } else {
            this.map.addLayer({
                id: 'line',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: line
                },
                layout: {},
                paint: {
                    'line-color': '#f08',
                    'line-width': 4,
                    'line-dasharray': [2, 1]
                }
            });
        }
    }

    removeLine() {
        this.map.removeLayer('line');
        this.map.removeSource('line');
    }

    zoomTo(geom) {
        const bounds = bbox(geom) as LngLatBoundsLike;
        this.map.fitBounds(bounds, { padding: 60 });
    }

    flyToDK() {
        this.map.flyTo({ center: this.center as LngLatLike, zoom: this.zoom })
    }

    getDistance(point1: [number, number], point2: [number, number]): number {
        return distance(point1, point2);
    }
}
