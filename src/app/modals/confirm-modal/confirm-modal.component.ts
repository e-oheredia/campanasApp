import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  constructor( public bsModalRef: BsModalRef ) { }

  @Output() confirmarEvent = new EventEmitter();
  mensaje: string;

  ngOnInit() {
  }

  confirmar(){
    this.bsModalRef.hide();
    this.confirmarEvent.emit();
  }

}
