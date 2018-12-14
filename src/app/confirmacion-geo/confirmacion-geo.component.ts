import { TrackingCampanaComponent } from './../modals/tracking-campana/tracking-campana.component';
import { Campana } from '../model/campana.model';
import { Component, OnInit } from '@angular/core';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { TituloService } from '../services/titulo.service';
import { CampanaService } from '../services/campana.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppSettings } from '../settings/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { ModificarBaseComponent } from './modificar-base/modificar-base.component';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-confirmacion-geo',
  templateUrl: './confirmacion-geo.component.html',
  styleUrls: ['./confirmacion-geo.component.css']
})
export class ConfirmacionGeoComponent implements OnInit {

  constructor(
    private tituloService:TituloService,
    private campanaService:CampanaService,
    private modalService:BsModalService,
    private notifier: NotifierService
  ) { }



  settings = AppSettings.tableSettings;
  dataCampanasGeoreferenciadas:LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];

  ngOnInit() {
    this.tituloService.setTitulo("Confirmación de Bases Georeferenciadas");
    this.settings.columns = {
      linkTracking: {
        title: 'Tracking',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction:(instance:any)=>{
          instance.claseIcono="fas fa-clipboard-list";
          instance.pressed.subscribe(row=>{
            this.visualizarSeguimiento(row);
          })
        }
      },
      id: {
        title: 'Número de campaña'
      },
      nombre: {
        title: 'Nombre de Campaña'
      },
      tipoCampana: {
        title: 'Tipo de Campaña'
      },
      tipoDocumento: {
        title: 'Tipo de Documento'
      },
      noDistribuible: {
        title: 'No Distribuibles'
      },
      normalizado: {
        title: 'Normalizados'
      },
      contador: {
        title: 'Contador Geo'
      },
      fechaIngresoCampana: {
        title: 'Fecha de Ingreso de Campaña'
      },
      buttonDescargar: {
        title: 'Descargar Base',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.pressed.subscribe(row => {
            this.descargarBase(row);
          });
        }
      },
      buttonModificar: {
        title: 'Modificar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction:(instance: any) => {
          instance.claseIcono = "fas fa-pen";
          instance.pressed.subscribe(row => {
            this.modificarBase(row);
          });
        }
      },
      buttonConfirmar: {
        title: 'Confirmar Base con Geo',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction:(instance: any) => {
          instance.claseIcono = "fas fa-check-circle";
          instance.pressed.subscribe(row => {
            this.confirmarBase(row);
          });
        }
      }
    };
    this.listarCampanasGeoreferenciadas();
  }

  descargarBase(row) {
    this.campanaService.exportarItemsCampanaPorGeoReferenciar(this.campanas.find(campana => campana.id == row.id));
  }

  modificarBase(row){
    // 
  }

  confirmarBase(campana: Campana){
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent,{
      initialState: {
        mensaje: "¿Está seguro de confirmar la base georeferenciada?"
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.confirmarBaseGeo(campana).subscribe(
        () => {
          this.notifier.notify('success', 'Se ha autorizado correctamente el envío');
          this.listarCampanasGeoreferenciadas();
        },
        error => {
          console.log('holitas')
        }
      )
    });
  }



  visualizarSeguimiento(row) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == row.id)
      },
      class: 'modal-lg'
    });
  }


  listarCampanasGeoreferenciadas(){
    this.dataCampanasGeoreferenciadas.reset();
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.GEOREFERENCIADA).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasGeoreferenciadas = [];
        campanas.forEach(
          campana => {
          dataCampanasGeoreferenciadas.push({
            id: campana.id,
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,
            noDistribuible: campana.itemsCampana.filter(documento => documento.enviable===true).length,
            normalizado: campana.itemsCampana.filter(documento => documento.enviable===false).length,
            contador: campana.seguimientosCampana.filter(seguimientocampana => seguimientocampana.estadoCampana.id===EstadoCampanaEnum.GEOREFERENCIADA).length,
            fechaIngresoCampana: this.campanaService.getFechaCreacion(campana)
          });
        });
        this.dataCampanasGeoreferenciadas.load(dataCampanasGeoreferenciadas);
      }

    )
  }



}





