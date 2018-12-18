import { TrackingCampanaComponent } from './../modals/tracking-campana/tracking-campana.component';
import { Campana } from '../model/campana.model';
import { Component, OnInit } from '@angular/core';
import { TituloService } from '../services/titulo.service';
import { CampanaService } from '../services/campana.service';
import { AppSettings } from '../settings/app.settings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { LocalDataSource } from 'ng2-smart-table';
import { SubirBaseGeoreferenciadaComponent } from './subir-base-georeferenciada/subir-base-georeferenciada.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-visualizar-pedidos-georeferencia',
  templateUrl: './visualizar-pedidos-georeferencia.component.html',
  styleUrls: ['./visualizar-pedidos-georeferencia.component.css']
})
export class VisualizarPedidosGeoreferenciaComponent implements OnInit {

  constructor(
    private tituloService: TituloService, 
    private campanaService: CampanaService, 
    private modalService: BsModalService,
    private notifier: NotifierService
  ) { }

  settings = AppSettings.tableSettings;
  dataCampanasPorGeoreferenciar: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];
  prefijo = AppSettings.PREFIJO;

  estadosCampana : number[] = [EstadoCampanaEnum.ASIGNADA,EstadoCampanaEnum.GEOREFERENCIADA_Y_MODIFICADA];


  ngOnInit() {
    this.tituloService.setTitulo("Campañas por Georeferenciar");
    this.generarColumnas();
    this.listarCampanasPorGeoreferenciar();
  }

  generarColumnas(){
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
        title: 'Número de Campaña'
      },     
      nombre: {
        title: 'Nombre'
      },
      tipoCampana: {
        title: 'Tipo de Campaña'
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
      estado : {
        title: 'Estado'
      },
      button: {
        title: 'Descargar Base',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-hand-pointer";
          instance.pressed.subscribe(row => {
            this.descargarBase(row);
          });
        }
      },
      
      buttonCarga: {
        title: 'Subir Base',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-hand-pointer";
          instance.pressed.subscribe(row => {
            this.subirBase(row);
          });
        }
      },
    };
  }

  descargarBase(row) {
    this.campanaService.exportarItemsCampanaPorGeoReferenciar(this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)));
  }

  subirBase(row) {
    let bsModalRef: BsModalRef = this.modalService.show(SubirBaseGeoreferenciadaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)),
        title : 'Subir Base',
      },
      class: 'modal-lg',    
      keyboard: false, 
      backdrop: "static",  
    });

    
    
    this.modalService.onHide.subscribe(
    () => {
      this.listarCampanasPorGeoreferenciar();
    })
    
  }

  
  //ignoreBackdropClick: false,     
  visualizarSeguimiento(row) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg',
      keyboard: false,
      backdrop: "static",  
    });
  }

  listarCampanasPorGeoreferenciar() {
    this.dataCampanasPorGeoreferenciar = new LocalDataSource();;
    this.campanas = [];
    this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasPorGeoreferenciar = [];
        campanas.forEach(campana => {
          dataCampanasPorGeoreferenciar.push({
            id: this.campanaService.codigoAutogenerado(campana.id,this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,            
            cantidadLima: campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
            cantidadProvincia: campana.itemsCampana.length - campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
            estado: this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.nombre
          });
        });
        this.generarColumnas();
        this.dataCampanasPorGeoreferenciar.load(dataCampanasPorGeoreferenciar);
      }

    )
  }

}
