import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
    @Input() categories: { name: string, id: string }[];
    @Output() selectedCategory = new EventEmitter();
    constructor() { }

    ngOnInit() {
    }

    selected(id) {
        this.selectedCategory.emit(id);
    }
}
