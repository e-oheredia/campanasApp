import { ItemCampana } from './../model/itemcampana.model';
import { MensajeExitoComponent } from './../modals/mensaje-exito/mensaje-exito.component';
import { ConfirmModalComponent } from './../modals/confirm-modal/confirm-modal.component';
import { TrackingCampanaComponent } from './../modals/tracking-campana/tracking-campana.component';
import { ButtonViewComponent } from './../table-management/button-view/button-view.component';
import { AprobarGuiaComponent } from './aprobar-guia/aprobar-guia.component';
import { Campana } from './../model/campana.model';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from './../settings/app.settings';
import { TituloService } from './../services/titulo.service';
import { CampanaService } from './../services/campana.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-verificar-guia',
  templateUrl: './verificar-guia.component.html',
  styleUrls: ['./verificar-guia.component.css']
})
export class VerificarGuiaComponent implements OnInit {

  constructor(
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService
  ) { }

  settings = Object.assign({}, AppSettings.tableSettings);
  dataCampanaVerificarGuia: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];
  prefijo = AppSettings.PREFIJO;

  ngOnInit() {
    this.tituloService.setTitulo("Verificación de Guía");
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
      cantidadInicialLima: {
        title: 'Cantidad Inicial Lima'
      },
      cantidadFinalLima: {
        title: 'Cantidad Normalizada Lima'
      },
      cantidadInicialProvincia: {
        title: 'Cantidad Inicial Provincia'
      },
      cantidadFinalProvincia: {
        title: 'Cantidad Normalizada Provincia'
      },
      fechaIngreso: {
        title: 'Fecha de Ingreso de Campaña'
      },
      cotizacion: {
        title: 'Cotización'
      },
      btnDescargarConformidad: {
        title: 'Guía',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.mostrarData.subscribe(row => {
            instance.claseIcono = "fa fa-eye";
            let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
            instance.ruta = AppSettings.URL_GUIAS + campana.rutaGuia;

          })
        }

      },
      btnConfirmar: {
        title: 'Confirmar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-check-circle";
          instance.pressed.subscribe(row => {
            this.aceptarGuia(row);
          });
        }
      },
      btnDenegar: {
        title: 'Denegar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-times-circle";
          instance.pressed.subscribe(row => {
            this.denegarGuia(row);
          });
        }
      },
    };
    this.listarCampanasVerificarGuia();
  }

  visualizarSeguimiento(row) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg'
    });
  }

  aceptarGuia(row) {
    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(AprobarGuiaComponent, {
      initialState: {
        titulo: "Campaña : " + row.nombre,
        mensaje: "¿Está seguro de aceptar la guía?",
        nota: "Tener en cuenta que el Proveedor recibirá la Operativa (Datos de inicio de Distribución)"
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe((datosAprobarGuiaForm) => {

      
      let fi = new Date(new Date(datosAprobarGuiaForm.fechaDistribucion).getTimezoneOffset() * 60 * 1000 + new Date(datosAprobarGuiaForm.fechaDistribucion).getTime());
      c.fechaDistribucion = moment(new Date(fi)).format("DD-MM-YYYY HH:mm:ss");

      this.campanaService.aceptarGuia(c).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "La guía fue aceptada"
            },
          });
          this.listarCampanasVerificarGuia();
        },
        error => {
          console.log(error);
        }
      )



    });
  }

  denegarGuia(row) {
    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Campaña : " + row.nombre,
        mensaje: "¿Está seguro de denegar la guía?",
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.denegarGuia(c.id).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "La guía fue denegada"
            },
          });
          this.listarCampanasVerificarGuia();
        },
        error => {
          console.log(error);
        }
      )
    });
  }

  listarCampanasVerificarGuia() {
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.GUIA_ADJUNTADA).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanaVerificarGuia = [];
        campanas.forEach(campana => {
          dataCampanaVerificarGuia.push({
            id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadInicialLima: this.contarDocumentos(campana.itemsCampana),
            cantidadInicialProvincia: this.contarDocumentos(campana.itemsCampana, false),
            cantidadFinalLima: this.contarDocumentos(campana.itemsCampana, true, true),
            cantidadFinalProvincia: this.contarDocumentos(campana.itemsCampana, false, true),
            fechaIngreso: this.campanaService.getFechaCreacion(campana),
            cotizacion: "S/. " + campana.costoCampana.toString(),
            rutaAutorizacion: campana.rutaAutorizacion
          });
        });
        this.dataCampanaVerificarGuia.load(dataCampanaVerificarGuia);
      }
    )
  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;
  }

}
