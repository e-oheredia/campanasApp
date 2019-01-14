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
import { AdjuntarArchivoComponent } from '../modals/adjuntar-archivo/adjuntar-archivo.component';

@Component({
  selector: 'app-subir-muestra',
  templateUrl: './subir-muestra.component.html',
  styleUrls: ['./subir-muestra.component.css']
})
export class SubirMuestraComponent implements OnInit {

  constructor(
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService,
  ) { }

  campanas: Campana[] = [];
  campana: Campana;
  settings = AppSettings.tableSettings;
  dataCampanas: LocalDataSource = new LocalDataSource();
  prefijo = AppSettings.PREFIJO;
  estadosCampana: number[] = [
    
    EstadoCampanaEnum.MUESTRA_SOLICITADA,
    EstadoCampanaEnum.MUESTRA_DENEGADA];


  ngOnInit() {
    this.tituloService.setTitulo("Subir Muestra");
    this.generarColumnas();
    this.listarCampanasParaSubirMuestra();
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
      solicitante: {
        title: 'Solicitante'
      },
      areaSolicitante: {
        title: 'Área solicitante'
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

      buttonSsubirMuestra: {
        title: 'Subir Muestra',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {

          
          instance.claseIcono = "fas fa-chalkboard-teacher";
          instance.pressed.subscribe(row => {
            this.adjuntarMuestra(row);
          });
        }
      },


    };
  }

  listarCampanasParaSubirMuestra() {
    this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanas = [];
        campanas.forEach(campana => {

          let campana_u = this.campanaService.getUltimoSeguimientoCampana(campana);
          let fecha_solicitud: any;

          if (campana_u.estadoCampana.id === EstadoCampanaEnum.CONFORMIDAD_ACEPTADA){
            fecha_solicitud = "";
          }
          else{
            fecha_solicitud = this.campanaService.getFechaMuestraSolicitada(campana);
          }

          dataCampanas.push({
            id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            solicitante: campana.buzon.nombre,
            areaSolicitante: campana.buzon.area.nombre,
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

  adjuntarMuestra(row: any) {
    this.campana = this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id));
    let bsModalRef: BsModalRef = this.modalService.show(AdjuntarArchivoComponent, {
        initialState: {
            campana: this.campana,            
            titulo: "Adjuntar Muestra - Campaña " + row.nombre,
            textoAceptar: "Enviar",
            textoCancelar: "Cancelar",
            tipoArchivo: ".pdf"
        },
        class: 'modal-md',
        keyboard: false,
        backdrop: "static"
    });
                        
    bsModalRef.content.confirmarEvent.subscribe((archivoHijo) => {
        console.log(archivoHijo);
        this.campanaService.adjuntarMuestra(this.campana, archivoHijo).subscribe(
            () => {
          
                let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
                  initialState : {
                    mensaje: "La muestra de la campaña se adjuntó correctamente"
                  }
                });
                this.listarCampanasParaSubirMuestra();
              },
              error => {
                  console.log("hola")
              }
        )
    });
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

}
