import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-summery',
  templateUrl: './summery.component.html',
  styleUrls: ['./summery.component.scss']
})
export class SummeryComponent implements OnInit {
  @Input() distance: number;
  @Input() links: any[];
  @Output() replay = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  playAgain() {
    this.replay.emit();
  }

}
