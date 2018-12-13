import { ItemCampana } from './../model/itemcampana.model';
import { TrackingCampanaComponent } from './../modals/tracking-campana/tracking-campana.component';
import { ButtonViewComponent } from './../table-management/button-view/button-view.component';
import { Campana } from './../model/campana.model';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from './../settings/app.settings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from './../services/campana.service';
import { TituloService } from './../services/titulo.service';
import { Component, OnInit } from '@angular/core';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { RecotizarCampanaComponent } from './recotizar-campana/recotizar-campana.component';

@Component({
  selector: 'app-recotizacion-campana',
  templateUrl: './recotizacion-campana.component.html',
  styleUrls: ['./recotizacion-campana.component.css']
})
export class RecotizacionCampanaComponent implements OnInit {

  constructor(
    private tituloService: TituloService, 
    private campanaService: CampanaService, 
    private modalService: BsModalService
  ) { }

  settings = Object.assign({}, AppSettings.tableSettings);
  dataCampanasParaRecotizar: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];

  ngOnInit() {
    this.tituloService.setTitulo("Recotización de Campañas");
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
      solicitante: {
        title: 'Solicitante'
      },
      regulatorio: {
        title: 'Regulatorio'
      },
      tipoDocumento: {
        title: 'Tipo de Documento'
      },
      tipoDestino: {
        title: 'Tipo de Destino'
      },
      cantidadLima: {
        title: 'Cantidad Lima / Normalizados'
      },
      cantidadProvincia: {
        title: 'Cantidad Provincia / Normalizados'
      },
      button: {
        title: 'Recotizar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-hand-pointer";
          instance.pressed.subscribe(row => {
            this.recotizarCampana(row);
          });
        }
      },
    };
    this.listarCampanasParaRecotizar();
  }

  recotizarCampana(row: any){
    let bsModalRef: BsModalRef = this.modalService.show(RecotizarCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == row.id)
      },
      class: 'modal-lg'
    });
    
    this.modalService.onHide.subscribe(
      () => this.listarCampanasParaRecotizar()
    )
  }

  visualizarSeguimiento(row: any) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == row.id)
      },
      class: 'modal-lg'
    });
  }

  listarCampanasParaRecotizar() {
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.GEOREFERENCIADA_Y_CONFIRMADA).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasParaRecotizar = [];
        campanas.forEach(campana => {
          dataCampanasParaRecotizar.push({
            id: campana.id,
            nombre: campana.nombre,
            solicitante: campana.buzon.nombre,
            regulatorio: campana.regulatorio ? 'Sí':'No',
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadLima: this.contarDocumentos(campana.itemsCampana) + " / " + this.contarDocumentos(campana.itemsCampana, true, true),
            cantidadProvincia:this.contarDocumentos(campana.itemsCampana, false) + " / " + this.contarDocumentos(campana.itemsCampana, false, true)
          });
        });
        this.dataCampanasParaRecotizar.load(dataCampanasParaRecotizar);
      }
    )
  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;    
  }



}
