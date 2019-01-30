import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-aprobar-guia',
  templateUrl: './aprobar-guia.component.html',
  styleUrls: ['./aprobar-guia.component.css']
})
export class AprobarGuiaComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { }

  @Output() confirmarEvent = new EventEmitter();
  mensaje: string;
  titulo: string = "Confirmar Acción";
  textoAceptar : string = "Aceptar";
  textoCancelar: string = "Cancelar";
  nota: string;

  datosAprobarGuiaForm: FormGroup;

  ngOnInit() {
    this.datosAprobarGuiaForm = new FormGroup({
      'fechaDistribucion' : new FormControl(null, Validators.required)
    })
  }

  confirmar(){
    this.bsModalRef.hide();
    this.confirmarEvent.emit(this.datosAprobarGuiaForm.value);
  }

}
