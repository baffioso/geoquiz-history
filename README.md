# Geoquiz

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Using Wikidata - The Battles

The Battles have been created by using wikidata query service, downloaded to PostGIS and rated. The rating was necessary in order to have a 'easy' and 'hard' questions mixture. Admittedly, labelling something 'easy' is highly idiosyncratic. 
Wikidata query as follows:

#slag that have sitelinks to en.wiki
#defaultView:Map

SELECT ?slagLabel ?article ?krigLabel ?slagstedLabel ?slagdato ?koord WHERE {
  ?slag wdt:P31 wd:Q178561 . # krig
    ?article schema:about ?slag .
    ?article schema:isPartOf <https://en.wikipedia.org/>.
        ?slag wdt:P361 ?krig.
        ?slag wdt:P585 ?slagdato.
        ?slag wdt:P276 ?slagsted.
        ?slag wdt:P625 ?koord.
    SERVICE wikibase:label {
       bd:serviceParam wikibase:language "en"
    }
    }

Link: https://w.wiki/XZn

## Using Wikidata - UNESCO Heritage sites

The Sites have been created by using wikidata query service, downloaded to PostGIS and rated. The rating was necessary in order to have a 'easy' and 'hard' questions mixture. Admittedly, labelling something 'easy' is highly idiosyncratic - eurocentric to say the least.
Wikidata query as follows:

#world heritage Q9259
#defaultView:Map

SELECT ?hsiteLabel ?articleen ?billede ?countryLabel ?koord WHERE {
    ?hsite wdt:P1435 wd:Q9259.
    ?articleen schema:about ?hsite .
  {?articleen schema:isPartOf <https://en.wikipedia.org/>}.
  OPTIONAL {?hsite wdt:P18 ?billede.
  ?hsite wdt:P625 ?koord}.
    ?hsite wdt:P17 ?country.
   SERVICE wikibase:label {
       bd:serviceParam wikibase:language "en"
    }
}

Link: https://w.wiki/XZo
