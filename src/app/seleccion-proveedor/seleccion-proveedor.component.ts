import { TrackingCampanaComponent } from './../modals/tracking-campana/tracking-campana.component';
import { Campana } from '../model/campana.model';
import { SeleccionarProveedorComponent } from './seleccionar-proveedor/seleccionar-proveedor.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from '../services/campana.service';
import { AppSettings } from '../settings/app.settings';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TituloService } from '../services/titulo.service';
import { Component, OnInit } from '@angular/core';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-seleccion-proveedor',
  templateUrl: './seleccion-proveedor.component.html',
  styleUrls: ['./seleccion-proveedor.component.css']
})
export class SeleccionProveedorComponent implements OnInit {

  constructor(
    private tituloService: TituloService, 
    private campanaService: CampanaService,
    private modalService: BsModalService
  ) { }

  settings = Object.assign({}, AppSettings.tableSettings);
  dataCampanasCreadas: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];
  prefijo = AppSettings.PREFIJO;

  ngOnInit() {
    this.tituloService.setTitulo("Selección de Proveedor");
    this.settings.columns = {
      linkTracking: {
        title: 'Tracking',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-clipboard-list";
          instance.pressed.subscribe(row => {
            this.visualizarSeguimiento(row);
          });
        }
      },
      id: {
        title: 'Código de Campaña'
      },      
      nombre: {
        title: 'Nombre de Campaña'
      },
      areaSolicitante: {
        title: 'Area Solicitante'
      },
      solicitante: {
        title: 'Solicitante'
      },
      regulatorio: {
        title: 'Regulatorio'
      },      
      tipoDestino: {
        title: 'Tipo de Destino'
      },
      tipoDocumento: {
        title: 'Tipo de Documento'
      },
      cantidadLima: {
        title: 'Cantidad Lima'
      },
      cantidadProvincia: {
        title: 'Cantidad Provincia'
      },
      fechaCreacion: {
        title: 'Fecha de Ingreso de Campaña'
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
    this.listarCampanasCreadas();
  }

  asignarProveedor(row) {
    let bsModalRef: BsModalRef = this.modalService.show(SeleccionarProveedorComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg'
    });
    
    this.modalService.onHide.subscribe(
      () => this.listarCampanasCreadas()
    )
  }

  visualizarSeguimiento(row) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg'
    });
  }

  listarCampanasCreadas() {
    this.dataCampanasCreadas = new LocalDataSource();
    this.campanas = []; 
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.CREADA).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasCreadas = [];
        campanas.forEach(campana => {
          dataCampanasCreadas.push({
            id: this.campanaService.codigoAutogenerado(campana.id,this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            solicitante: campana.buzon.nombre,
            areaSolicitante: campana.buzon.area.nombre,
            regulatorio: campana.regulatorio ? 'Sí':'No',
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadLima: campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
            cantidadProvincia: campana.itemsCampana.length - campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length, 
            fechaCreacion: this.campanaService.getFechaCreacion(campana)
          });
        });
        this.dataCampanasCreadas.load(dataCampanasCreadas);
      }

    )
  }

}
