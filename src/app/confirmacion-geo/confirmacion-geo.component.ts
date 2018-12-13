import { Campana } from '../model/campana.model';
import { Component, OnInit } from '@angular/core';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { TituloService } from '../services/titulo.service';
import { CampanaService } from '../services/campana.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppSettings } from '../settings/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { ModificarBaseComponent } from './modificar-base/modificar-base.component';


@Component({
  selector: 'app-confirmacion-geo',
  templateUrl: './confirmacion-geo.component.html',
  styleUrls: ['./confirmacion-geo.component.css']
})
export class ConfirmacionGeoComponent implements OnInit {

  constructor(
    private tituloService:TituloService,
    private campanaService:CampanaService,
    private modalService:BsModalService
  ) { }



  settings = AppSettings.tableSettings;
  dataCampanasGeoreferenciadas:LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];

  ngOnInit() {
    this.tituloService.setTitulo("Confirmación de Bases Georeferenciadas");
    this.settings.columns = {
      id: {
        title: 'Nombre de Campaña'
      },
      tipoCampana: {
        title: 'Tipo de Campaña'
      },
      tipoDocumento: {
        title: 'Tipo de Documento'
      },
      noDistribuible: {
        title: 'No Distribuible'
      },
      normalizado: {
        title: 'Normalizado'
      },
      estado: {
        title: 'Estado'
      },
      contador: {
        title: 'Contador Geo'
      },
      fechaIngresoCampana: {
        title: 'Fecha de Ingreso de Campaña'
      },
      descargar: {
        title: 'Descarga'
      },
      modificar: {
        title: 'Modificar'
      },
      confirmar: {
        title: 'Confirmar Base con Geo'
      },
      button: {
        title: 'Asignar Proveedor',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-hand-pointer";
          instance.pressed.subscribe(row => {
            this.asignarProveedor(row);
          });
        }
      },
    };
    this.listarCampanasGeoreferenciadas();
  }



  asignarProveedor(row){
    let bsModalRef: BsModalRef = this.modalService.show(ModificarBaseComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == row.id)
      },
      class: 'modal-lg'
    });
    
    this.modalService.onHide.subscribe(
      () => this.listarCampanasGeoreferenciadas()
    )
  }



  listarCampanasGeoreferenciadas(){
    this.dataCampanasGeoreferenciadas.reset();
    this.campanas = [];
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.CREADO).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasGeoreferenciadas = [];
        campanas.forEach(campana => {
          dataCampanasGeoreferenciadas.push({
            id: campana.id,
            nombre: campana.nombre,
            solicitante: campana.buzon.nombre,
            regulatorio: campana.regulatorio ? 'Sí':'No',
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadLima: campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
            cantidadProvincia: campana.itemsCampana.length - campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length
          });
        });
        this.dataCampanasGeoreferenciadas.load(dataCampanasGeoreferenciadas);
      }

    )
  }


}





