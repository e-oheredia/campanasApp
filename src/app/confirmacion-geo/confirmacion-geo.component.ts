import { ItemCampana } from './../model/itemcampana.model';
import { MensajeExitoComponent } from './../modals/mensaje-exito/mensaje-exito.component';
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
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService,
    private notifier: NotifierService
  ) { }



  settings = AppSettings.tableSettings;
  dataCampanasGeoreferenciadas: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];
  prefijo = AppSettings.PREFIJO;

  ngOnInit() {
    this.tituloService.setTitulo("Confirmación de Bases Georeferenciadas");
    this.generarColumnas();
    this.listarCampanasGeoreferenciadas();
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
          })
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
      noDistribuibleLima: {
        title: 'No Distribuibles Lima'
      },
      normalizadoLima: {
        title: 'Normalizadas Lima'
      },
      noDistribuibleProvincia: {
        title: 'No Distribuibles Provincia'
      },      
      normalizadoProvincia: {
        title: 'Normalizadas Provincia'
      },
      contador: {
        title: 'Contador Geo'
      },
      fechaIngresoCampana: {
        title: 'Fecha de Ingreso de Campaña'
      },
      buttonDescargar: {
        title: 'Descargar base de No distribuibles',
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
        title: 'Modificar y volver a Georeferenciar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
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
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-check-circle";
          instance.pressed.subscribe(row => {
            this.confirmarBase(row);
          });
        }
      }

    };
  }

  descargarBase(row) {
    let campana = this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id));
    if (campana.itemsCampana.filter(itemCampana => !itemCampana.enviable).length === 0) {
      this.notifier.notify("info", "No se encontraron NO DISTRIBUIBLES");
      return;
    }
    this.campanaService.exportarItemsCampanaPorGeoReferenciar(campana);
  }

  modificarBase(row) {

    let campana = this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id));
    if (campana.itemsCampana.filter(itemCampana => !itemCampana.enviable).length === 0) {
      this.notifier.notify("info", "No se encontraron NO DISTRIBUIBLES");
      return;
    }

    let bsModalRef: BsModalRef = this.modalService.show(ModificarBaseComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)),
        title: 'Subir Base',
      },
      class: 'modal-lg',
      keyboard: false,
      backdrop: "static",
    });

    this.modalService.onHide.subscribe(
      () => {
        this.listarCampanasGeoreferenciadas();
      })
  }

  confirmarBase(row) {

    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: "¿Está seguro de confirmar la base georeferenciada?",
        textoAceptar: "Confirmar",
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.confirmarBaseGeo(c).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se ha autorizado correctamente el envío "
            }
          });
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
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg'
    });
  }


  listarCampanasGeoreferenciadas() {
    this.dataCampanasGeoreferenciadas.reset();
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.GEOREFERENCIADA).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasGeoreferenciadas = [];
        campanas.forEach(
          campana => {
            dataCampanasGeoreferenciadas.push({
              id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
              nombre: campana.nombre,
              tipoCampana: campana.tipoCampana.nombre,
              tipoDestino: campana.tipoDestino.nombre,
              tipoDocumento: campana.tipoDocumento.nombre,
              noDistribuibleLima: this.contarDocumentos(campana.itemsCampana) - this.contarDocumentos(campana.itemsCampana, true, true),
              noDistribuibleProvincia: this.contarDocumentos(campana.itemsCampana, false) - this.contarDocumentos(campana.itemsCampana, false, true),
              normalizadoLima: this.contarDocumentos(campana.itemsCampana, true, true),
              normalizadoProvincia: this.contarDocumentos(campana.itemsCampana, false, true),
              contador: campana.seguimientosCampana.filter(seguimientocampana => seguimientocampana.estadoCampana.id === EstadoCampanaEnum.GEOREFERENCIADA).length,
              fechaIngresoCampana: this.campanaService.getFechaCreacion(campana)
            });
          });
        this.dataCampanasGeoreferenciadas.load(dataCampanasGeoreferenciadas);
      }
    )
  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;
  }



}





