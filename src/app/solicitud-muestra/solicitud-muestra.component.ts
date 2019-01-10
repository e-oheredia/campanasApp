import { MensajeExitoComponent } from '../modals/mensaje-exito/mensaje-exito.component';
import { TrackingCampanaComponent } from '../modals/tracking-campana/tracking-campana.component';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TituloService } from '../services/titulo.service';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../settings/app.settings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from '../services/campana.service';
import { Campana } from '../model/campana.model';
import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../model/tipodocumento.model';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { ItemCampana } from '../model/itemcampana.model';
import { Row } from 'ng2-smart-table/lib/data-set/row';

@Component({
  selector: 'app-solicitud-impresion',
  templateUrl: './solicitud-muestra.component.html',
  styleUrls: ['./solicitud-muestra.component.css']
})
export class SolicitudMuestraComponent implements OnInit {

  constructor(
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService,
  ) { }

  campanas: Campana[] = [];
  settings = AppSettings.tableSettings;
  dataCampanas: LocalDataSource = new LocalDataSource();
  prefijo = AppSettings.PREFIJO;
  estadosCampana: number[] = [
    EstadoCampanaEnum.CONFORMIDAD_ACEPTADA,    
    EstadoCampanaEnum.MUESTRA_SOLICITADA,
    EstadoCampanaEnum.MUESTRA_ADJUNTADA,
    EstadoCampanaEnum.MUESTRA_DENEGADA];


  ngOnInit() {
    this.tituloService.setTitulo("Solicitud de Muestra");
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
      fechaSolicitud: {
        title: 'Fecha de Solicitud de Muestra'
      },
      estado: {
        title: 'Estado'
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

      buttonSolicitarMuestra: {
        title: 'Solicitar Muestra',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {

          if (this.campanas.length > 0) {

            instance.mostrarData.subscribe(row => {
              let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
              let estado_id = this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.id;
              if (estado_id === 8) {
                instance.claseIcono = "fas fa-chalkboard-teacher";
              }
            });
          }

          instance.pressed.subscribe(row => {
            this.solicitarMuestra(row);
          });
        }
      },

      buttonDescargarMuestra: {
        title: 'Descargar Muestra',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {

          if (this.campanas.length > 0) {

            instance.mostrarData.subscribe(row => {
              let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
              instance.ruta = AppSettings.URL_MUESTRAS + campana.rutaMuestra;
              let estado_id = this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.id;
              if (estado_id === 11 || estado_id === 13) {
                instance.claseIcono = "fas fa-file-pdf";
              }
            });
          }
        }
      },


      buttonAprobarMuestra: {
        title: 'Aprobar Muestra',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {

          if (this.campanas.length > 0) {

            instance.mostrarData.subscribe(row => {
              let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
              let estado_id = this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.id;
              if (estado_id === 11) {
                instance.claseIcono = "fas fa-thumbs-up";
              }
            });
          }
          instance.pressed.subscribe(row => {
            this.aprobarMuestra(row);
          });
        }
      },

      buttonSolicitarImpresion: {
        title: 'Denegar Muestra',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {

          if (this.campanas.length > 0) {

            instance.mostrarData.subscribe(row => {
              let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
              let estado_id = this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.id;
              if (estado_id === 11) {
                instance.claseIcono = "fas fa-thumbs-down";
              }
            });
          }

          instance.pressed.subscribe(row => {
            this.denegarMuestra(row);
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

          let campana_u = this.campanaService.getUltimoSeguimientoCampana(campana);
          let fecha_solicitud = campana_u.fecha;

          if (campana_u.estadoCampana.id === 8){
            fecha_solicitud = "";
          }

          dataCampanas.push({
            id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadLima: this.contarDocumentos(campana.itemsCampana.filter(x => x.enviable == true), true),
            cantidadProvincia: this.contarDocumentos(campana.itemsCampana.filter(x => x.enviable == true), false),
            fechaSolicitud: fecha_solicitud,
            estado: campana_u.estadoCampana.nombre,
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


  solicitarMuestra(row: any) {

    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Solicitar muestra - Campaña " + row.nombre,
        mensaje: "¿Está seguro de solicitar la muestra de la campaña?",
        textoAceptar: "Si",
        textoCancelar: "No"
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.solicitarMuestra(c.id).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "La solicitud de muestra fue enviada correctamente"
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
 

  aprobarMuestra(row: any) {

    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: " Aprobación de muestra impresa - Campaña " + row.nombre,
        mensaje: "¿Está seguro de aprobar la muestra impresa?",
        textoAceptar: "Si",
        textoCancelar: "No"
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.aprobarMuestra(c.id).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se ha aprobado la muestra correctamente"
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

  denegarMuestra(row: any) {

    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: " Denegación de muestra impresa - Campaña " + row.nombre,
        mensaje: "¿Está seguro de denegar la muestra impresa?",
        textoAceptar: "Si",
        textoCancelar: "No"
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.denegarMuestra(c.id).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se ha denegado la muestra correctamente"
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
