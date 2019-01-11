import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/services/utils.service';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Campana } from 'src/app/model/campana.model';

@Component({
  selector: 'app-datos-recojo',
  templateUrl: './datos-recojo.component.html',
  styleUrls: ['./datos-recojo.component.css']
})
export class DatosRecojoComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public utilsService: UtilsService,
    private notifier: NotifierService
  ) { }

  @Output() confirmarEvent = new EventEmitter<File>();

  campana: Campana;
  datosRecojoForm: FormGroup;

  titulo: string;


  ngOnInit() {
    this.datosRecojoForm = new FormGroup({
      'datoFecha' : new FormControl(null, Validators.required),
      'datoHora' : new FormControl(null, Validators.required),
      'datoImprenta' : new FormControl(null, Validators.required),
      'datoDireccion' : new FormControl(null, Validators.required),
      'datoContacto' : new FormControl(null, Validators.required)
    })
  }


  onSubmit(form: any){
    this.bsModalRef.hide();
    this.confirmarEvent.emit(this.datosRecojoForm.value);
  }



}
