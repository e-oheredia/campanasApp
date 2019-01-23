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
import { ItemCampana } from './../model/itemcampana.model';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { MensajeExitoComponent } from './../modals/mensaje-exito/mensaje-exito.component';


@Component({
  selector: 'app-verificar-conformidad',
  templateUrl: './verificar-conformidad.component.html',
  styleUrls: ['./verificar-conformidad.component.css']
})
export class VerificarConformidadComponent implements OnInit {

  constructor(
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService
  ) { }


  settings = Object.assign({}, AppSettings.tableSettings);
  dataCampanaVerficarConformidad: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];
  prefijo = AppSettings.PREFIJO;

  ngOnInit() {
    this.tituloService.setTitulo("Verificación de Conformidad");
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
        title: 'Descargar Conformidad',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.mostrarData.subscribe(row => {
            instance.claseIcono = "fa fa-eye";
            let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
            instance.ruta = AppSettings.URL_AUTORIZACIONES + campana.rutaAutorizacion;

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
            this.aceptarConformidad(row);
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
            this.denegarConformidad(row);
          });
        }
      },
    };
    this.listarCampanasVerificarConformidad();
  }

  visualizarSeguimiento(row: any) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg'
    });
  }

  //CONFORMIDAD_ADJUNTADA
  listarCampanasVerificarConformidad() {
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.CONFORMIDAD_ADJUNTADA).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanaVerficarConformidad = [];
        campanas.forEach(campana => {
          dataCampanaVerficarConformidad.push({
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
        this.dataCampanaVerficarConformidad.load(dataCampanaVerficarConformidad);
      }
    )
  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;
  }

  aceptarConformidad(row: any) {

    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Campaña : " + row.nombre,
        mensaje: "¿Está seguro de aceptar la conformidad?",
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.aceptarConformidad(c).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "La conformidad fue aceptada"
            },
          });
          this.listarCampanasVerificarConformidad();
        },
        error => {
          console.log('holitas')
        }
      )
    });
  }

  denegarConformidad(row: any) {
    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Campaña : " + row.nombre,
        mensaje: "¿Está seguro de denegar la conformidad?",
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.denegarConformidad(c).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "La conformidad fue denegada"
            }
          });
          this.listarCampanasVerificarConformidad();
        },
        error => {
          console.log('holitas')
        }
      )
    });
  }
}
