import { MensajeExitoComponent } from './../modals/mensaje-exito/mensaje-exito.component';
import { TrackingCampanaComponent } from './../modals/tracking-campana/tracking-campana.component';
import { ButtonViewComponent } from './../table-management/button-view/button-view.component';
import { TituloService } from './../services/titulo.service';
import { EstadoCampanaEnum } from './../enum/estadocampana.enum';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from './../settings/app.settings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from './../services/campana.service';
import { Campana } from './../model/campana.model';
import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../model/tipodocumento.model';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { ItemCampana } from './../model/itemcampana.model';

@Component({
  selector: 'app-solicitud-impresion',
  templateUrl: './solicitud-impresion.component.html',
  styleUrls: ['./solicitud-impresion.component.css']
})
export class SolicitudImpresionComponent implements OnInit {

  constructor(
    private tituloService: TituloService, 
    private campanaService: CampanaService, 
    private modalService: BsModalService,
  ) { }

  campanas: Campana[] = [];
  settings = AppSettings.tableSettings;
  dataCampanas: LocalDataSource = new LocalDataSource();
  prefijo = AppSettings.PREFIJO;
  estadosCampana : number[] = [EstadoCampanaEnum.CONFORMIDAD_VERIFICADA];


  ngOnInit() {
    this.tituloService.setTitulo("Solicitud de Impresión");
    this.generarColumnas();
    this.listarCampanasParaSolicitudImpresion();
  }

  generarColumnas() {
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
      fechaCreacion: {
        title: 'Fecha de Creación'
      },
      cotizacion: {
        title: 'Cotización'
      },
      buttonDescargarBaseImpresion: {
        title: 'Descargar Base Impresión',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.pressed.subscribe(row => {
            this.descargarBase(row);
          });
        }
      },
      
      buttonSolicitarImpresion: {
        title: 'Solicitar Impresión',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-print";
          instance.pressed.subscribe(row => {
            this.solicitarImpresion(row);
          });
        }
      },
    };
  }

  listarCampanasParaSolicitudImpresion() {
    this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanas = [];
        campanas.forEach(campana => {
          dataCampanas.push({
            id: this.campanaService.codigoAutogenerado(campana.id,this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,
            cantidadLima: this.contarDocumentos(campana.itemsCampana.filter(x=> x.enviable==true),true),
            cantidadProvincia: this.contarDocumentos(campana.itemsCampana.filter(x=> x.enviable==true), false),
            fechaCreacion: this.campanaService.getFechaCreacion(campana),
            cotizacion: campana.costoCampana,
          });
        });
        this.dataCampanas.load(dataCampanas);
      }
    )
  }

  descargarBase(row) {
    this.campanaService.exportarItemsCampanaPendienteConfirmaciónAdjunta(this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)));

  }

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

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;    
  }

/*
  solicitarImpresion(row) {
    let idCampana = this.campanaService.extraerIdAutogenerado(row.id);
    this.campanaService.solicitarImpresion(idCampana).subscribe( () => {
      let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
        initialState : {
          mensaje: "Se ha solicitado la impresión a Logística Correctamente"
        }
      });  
      this.listarCampanasParaSolicitudImpresion();
    })
  }
*/
  solicitarImpresion(row: any){

    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Campaña : " + row.nombre,
        mensaje: "¿Está seguro de enviar la solicitud a impresión?",
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {      
      this.campanaService.solicitarImpresion(c.id).subscribe(
        () => {
         
          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState : {              
              mensaje: "Se ha solicitado la impresión a Logística Correctamente"
            },
          });
          this.listarCampanasParaSolicitudImpresion();
        },
        error => {
          console.log('holitas')
        }
      )
    });
  }

}
