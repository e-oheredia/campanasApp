import { MensajeExitoComponent } from './../../modals/mensaje-exito/mensaje-exito.component';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Campana } from '../../model/campana.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemCampana } from './../../model/itemcampana.model';
import { CampanaService } from '../../services/campana.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-adjuntar-correo',
  templateUrl: './adjuntar-correo.component.html',
  styleUrls: ['./adjuntar-correo.component.css']
})
export class AdjuntarCorreoComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public utilsService: UtilsService,
    private notifier: NotifierService
  ) { }

  @Output() confirmarEvent = new EventEmitter<File>();

  campana: Campana;
  itemsCampanaCargados: ItemCampana[] = [];
  campanaForm: FormGroup;
  archivoAdjunto: File;
  archivosPermitidos: string;

  mensaje: string;
  titulo: string;

  ngOnInit() {
    this.campanaForm = new FormGroup({
      'archivoExcel': new FormControl(null, Validators.required)
    })
  }


  onSubmit(form: any){  //al enviar - ts hijo
    if(this.campanaForm.get('archivoExcel') === null || 
      this.campanaForm.get('archivoExcel').value === "" ||
      this.campanaForm.get('archivoExcel').value === null){
        this.notifier.notify('error', "Debe seleccionar un archivo");
        return;
      }
    this.bsModalRef.hide();
    this.confirmarEvent.emit(this.archivoAdjunto);
  }




  onChangeExcelFile(file: File) {
    if (file == undefined || file == null) {
      this.archivoAdjunto = null;
      return;
    }
    this.archivoAdjunto = file;
  }



}
