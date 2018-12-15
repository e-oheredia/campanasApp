import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-button-view',
  templateUrl: './button-view.component.html',
  styleUrls: ['./button-view.component.css']
})
export class ButtonViewComponent implements ViewCell, OnInit {
  claseIcono: string = "";
  nombreBoton: string = "";
  constructor() { }

  @Input() value: string;
  @Input() rowData: any;

  @Output() pressed: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  onClick() {
    this.pressed.emit(this.rowData);
  }

}
