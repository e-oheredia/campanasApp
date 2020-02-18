import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensaje-exito',
  templateUrl: './mensaje-exito.component.html',
  styleUrls: ['./mensaje-exito.component.css']
})
export class MensajeExitoComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) {}

  autogenerado: string;
  public mensaje: string;

  ngOnInit() {
  }

  aceptar(){
    this.bsModalRef.hide();
  }


}
