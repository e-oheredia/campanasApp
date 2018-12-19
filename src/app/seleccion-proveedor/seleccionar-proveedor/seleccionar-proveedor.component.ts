import { MensajeExitoComponent } from './../../modals/mensaje-exito/mensaje-exito.component';
import { ItemCampana } from './../../model/itemcampana.model';
import { Proveedor } from '../../model/proveedor.model';
import { TipoCampana } from '../../model/tipocampana.model';
import { ProveedorService } from '../../services/proveedor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Campana } from '../../model/campana.model';
import { CampanaService } from '../../services/campana.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoCampanaService } from '../../services/tipocampana.service';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-seleccionar-proveedor',
  templateUrl: './seleccionar-proveedor.component.html',
  styleUrls: ['./seleccionar-proveedor.component.css']
})
export class SeleccionarProveedorComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public campanaService: CampanaService, 
    public tipoCampanaService: TipoCampanaService,
    public proveedorService: ProveedorService,
    public notifier: NotifierService, 
    public utilsService: UtilsService,
    private modalService: BsModalService
  ) { }

  proveedorCampanaForm: FormGroup;
  campana: Campana;
  tiposCampana: TipoCampana[];
  proveedores: Proveedor[]

  ngOnInit() {
    this.proveedorCampanaForm = new FormGroup({
      'tipoCampana': new FormControl(null, Validators.required), 
      'proveedor': new FormControl(null, Validators.required), 
      'costoCampana': new FormControl(null, Validators.required)      
    });
    this.listarTiposCampana();
    this.listarProveedores();
  }

  listarTiposCampana(){
    this.tipoCampanaService.listarAll().subscribe(
      tiposCampana => this.tiposCampana = tiposCampana
    );
  }

  listarProveedores(){
    this.proveedorService.listarAll().subscribe(
      proveedores => this.proveedores = proveedores
    );
  }

  onSubmit(form: any){
    this.campana.proveedor = form.proveedor;
    this.campana.tipoCampana = form.tipoCampana;
    this.campana.costoCampana = form.costoCampana;
    this.campanaService.seleccionarProveedor(this.campana).subscribe(
      () => {
        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState : {
            mensaje: "Se La asignación de tipo de campaña, proveedor y cotización fue correcta " + this.campana.proveedor.nombre
          }
        });
        this.bsModalRef.hide();
      }
    )    
  }

  contarDocumentosDeLima(documentos: ItemCampana[]): number {
    return documentos.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length;    
  }


}
