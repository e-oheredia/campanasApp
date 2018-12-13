import { ItemCampana } from './../../model/itemcampana.model';
import { Campana } from './../../model/campana.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from './../../services/utils.service';
import { NotifierService } from 'angular-notifier';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from './../../services/campana.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recotizar-campana',
  templateUrl: './recotizar-campana.component.html',
  styleUrls: ['./recotizar-campana.component.css']
})
export class RecotizarCampanaComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public campanaService: CampanaService, 
    public notifier: NotifierService, 
    public utilsService: UtilsService
  ) { }

  cotizacionCampanaForm: FormGroup;
  campana: Campana;

  ngOnInit() {
    this.cotizacionCampanaForm = new FormGroup({
      'costoCampana': new FormControl(this.campana.costoCampana, Validators.required)      
    });
  }

  onSubmit(form: any){
    this.campana.costoCampana = form.costoCampana;
    this.campanaService.recotizarCampana(this.campana).subscribe(
      () => {
        this.notifier.notify("success", "Se ha recotizado la campaña correctamente")
        this.bsModalRef.hide();
      }
    )    
  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;    
  }

}
