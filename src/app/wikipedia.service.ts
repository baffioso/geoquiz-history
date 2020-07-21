import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {

  constructor(private http: HttpClient) { }

  getExcerpt(wikiId) {
    return this.http.get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&exchars=100&titles=${wikiId}&format=json`)
      .pipe(
        map(console.log)
      )
  }
}
