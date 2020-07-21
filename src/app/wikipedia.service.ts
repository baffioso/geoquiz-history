import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WikipediaService {

    constructor(private http: HttpClient) { }

    getExcerpt(wikiId: string) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&exchars=150&titles=${wikiId}&format=json`;
        return this.http.jsonp(url, 'callback')
            .pipe(
                map((res: any) => {
                    const key = Object.keys(res.query.pages)[0];
                    const excerpt = res.query.pages[key].extract.slice(0, - 8) + ' ... </p>';
                    return excerpt;
                })
            );
    }
}
