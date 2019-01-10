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
import { NotifierService } from 'angular-notifier';
import { AdjuntarCorreoComponent } from './adjuntar-correo/adjuntar-correo.component';


@Component({
    selector: 'app-confirmacion-cotizacion',
    templateUrl: './confirmacion-cotizacion.component.html',
    styleUrls: ['./confirmacion-cotizacion.component.css']
})
export class ConfirmacionCotizacionComponent implements OnInit {

    constructor(
        private tituloService: TituloService,
        private campanaService: CampanaService,
        private modalService: BsModalService,
        private notifier: NotifierService
    ) { }

    settings = AppSettings.tableSettings;
    dataCampanasPendientesPorAdjuntarConfirmacion: LocalDataSource = new LocalDataSource();
    campanas: Campana[] = [];
    prefijo = AppSettings.PREFIJO;
    campana: Campana;
    estadosCampana : number[] = [EstadoCampanaEnum.COTIZADA,EstadoCampanaEnum.CONFORMIDAD_DENEGADA];


    ngOnInit() {
        this.tituloService.setTitulo("Confirmación de Cotizaciones de Campañas");
          this.generarColumnas();
          this.listarCampanasPendientesPorAdjuntarConfirmacion();
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
            tipoDocumento: {
                title: 'Tipo de Documento'
            },
            requiereGeo: {
                title: 'Requiere Georeferencia'
            },
            cantidadInicial: {
                title: 'Cantidad Inicial Lima/Provincia'
            },
            cantidadFinal: {
                title: 'Cantidad Normalizada Lima/Provincia'
            },
            fechaIngresoCampana: {
                title: 'Fecha de Ingreso de Campaña'
            },
            estado: {
                title: 'Estado'
            },
            cotizacion: {
                title: 'Cotizacion'
            },
            buttonDescargar: {
                title: 'Descargar Base Completa',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.claseIcono = "fas fa-download";
                    instance.pressed.subscribe(row => {
                        this.descargarBase(row);
                    });
                }
            },
            buttonAdjuntarConformidad: {
                title: 'Adjuntar Conformidad',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.claseIcono = "fas fa-mail-bulk";
                    instance.pressed.subscribe(row => {
                        this.adjuntarPermiso(row);
                    });
                }
            }
        }
    }

    descargarBase(row) {
        this.campanaService.exportarItemsCampanaPendientesPorAdjuntarConfirmacion(this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)));
    }

    adjuntarPermiso(row){//ts padre
        this.campana = this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id));
        let bsModalRef: BsModalRef = this.modalService.show(AdjuntarCorreoComponent, {
            initialState: {
                campana: this.campana,
                mensaje: 'Adjunte la conformidad por la cotización de su Campaña',
                titulo: 'ADJUNTAR CONFORMIDAD DE GERENCIA'
            },
            class: 'modal-lg',
            keyboard: false,
            backdrop: "static"
        });
                            
        bsModalRef.content.confirmarEvent.subscribe((archivoHijo) => {
            console.log(archivoHijo);
            this.campanaService.adjuntarConformidad(this.campana, archivoHijo).subscribe(
                () => {
              
                    let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
                      initialState : {
                        mensaje: "Su conformidad se ha adjuntado correctamente"
                      }
                    });
                    this.listarCampanasPendientesPorAdjuntarConfirmacion();
                  },
                  error => {
                      console.log("hola")
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

    listarCampanasPendientesPorAdjuntarConfirmacion() {
        this.dataCampanasPendientesPorAdjuntarConfirmacion.reset();
        this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
          campanas => {
            this.campanas = campanas;
            let dataCampanasPendientesPorAdjuntarConfirmacion = [];
            campanas.forEach(
              campana => {
                dataCampanasPendientesPorAdjuntarConfirmacion.push({
                  id: this.campanaService.codigoAutogenerado(campana.id,this.prefijo.DOCUMENTO),
                  nombre: campana.nombre,
                  tipoCampana: campana.tipoCampana.nombre,
                  tipoDocumento: campana.tipoDocumento.nombre,
                  requiereGeo: campana.requiereGeorreferencia ? "SI" : "NO",
                  cantidadInicial:campana.itemsCampana.length,
                  cantidadFinal:campana.itemsCampana.filter(documento => documento.enviable === true).length,
                  fechaIngresoCampana:this.campanaService.getFechaCreacion(campana),
                  estado:this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.nombre,
                  cotizacion: 'S/. ' + campana.costoCampana
                });
              });
            this.dataCampanasPendientesPorAdjuntarConfirmacion.load(dataCampanasPendientesPorAdjuntarConfirmacion);
          }
    
        )
      }

}





