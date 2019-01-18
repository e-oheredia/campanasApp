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
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { ItemCampana } from '../model/itemcampana.model';
import { UtilsService } from '../services/utils.service';
import { Proveedor } from '../model/proveedor.model';
import { ProveedorImpresion } from '../model/proveedorimpresion.model';
import * as moment from 'moment-timezone';
import { AdjuntarArchivoComponent } from '../modals/adjuntar-archivo/adjuntar-archivo.component';

@Component({
  selector: 'app-recojo-campana',
  templateUrl: './recojo-campana.component.html',
  styleUrls: ['./recojo-campana.component.css']
})
export class RecojoCampanaComponent implements OnInit {

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
    EstadoCampanaEnum.CAMPANA_POR_RECOGER,    
    EstadoCampanaEnum.GUIA_DENEGADA];


  ngOnInit() {
    this.tituloService.setTitulo("Gestionar Muestra de Impresión");
    this.generarColumnas();
    this.listarCampanasPorRecojer();
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
        title: 'Código de campaña'
      },
      nombre: {
        title: 'Nombre de campaña'
      },
      tipoCampana: {
        title: 'Tipo de campaña'
      },
      tipoDestino: {
        title: 'Tipo de destino'
      },
      tipoDocumento: {
        title: 'Tipo de documento'
      },
      cantidadLima: {
        title: 'Cantidad Lima'
      },
      cantidadProvincia: {
        title: 'Cantidad Provincia'
      },
      fechaRecojo: {
        title: 'Fecha de recojo'
      },
      horaRecojo: {
        title: 'Hora de recojo'
      },
      imprentaSede: {
        title: 'Imprenta / Sede'
      },
      direccion: {
        title: 'Dirección'
      },
      contacto: {
        title: 'Contacto'
      },
      estado: {
        title: 'Estado'
      },
      buttonAdjuntarGuiaRecojo: {
        title: 'Adjuntar guía de recojo',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-paperclip";
          instance.pressed.subscribe(row => {
            this.adjuntarGuiaRecojo(row);
          });
        }
      }

    };
  }

  listarCampanasPorRecojer() {
    this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanas = [];
        campanas.forEach(campana => {

          let campana_u = this.campanaService.getUltimoSeguimientoCampana(campana);           

          let proveedorImpresion : ProveedorImpresion;
          proveedorImpresion = campana.proveedorImpresion;
          
          dataCampanas.push({
            id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadLima: this.contarDocumentos(campana.itemsCampana.filter(x => x.enviable == true), true),
            cantidadProvincia: this.contarDocumentos(campana.itemsCampana.filter(x => x.enviable == true), false),
            fechaRecojo: moment(proveedorImpresion.fechaRecojo, 'DD-MM-YYYY').format('DD-MM-YYYY'),
            horaRecojo: moment(proveedorImpresion.fechaRecojo, ' HH:mm:ss').format(' HH:mm:ss'),
            imprentaSede: proveedorImpresion.nombre,
            direccion: proveedorImpresion.direccion,
            contacto: proveedorImpresion.contacto,            
            estado: campana_u.estadoCampana.nombre,
          });
        });
        this.dataCampanas.load(dataCampanas);
      }
    )
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

  adjuntarGuiaRecojo(row: any) {

    this.campana = this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id));
    let bsModalRef: BsModalRef = this.modalService.show(AdjuntarArchivoComponent, {
        initialState: {
            campana: this.campana,            
            titulo: "Adjuntar guía de recojo - Campaña " + row.nombre,
            textoAceptar: "Enviar",
            textoCancelar: "Cancelar",
            tipoArchivo: ".png"
        },
        class: 'modal-md',
        keyboard: false,
        backdrop: "static"
    });
                        
    bsModalRef.content.confirmarEvent.subscribe((archivoHijo) => {
        console.log(archivoHijo);
        this.campanaService.adjuntarGuiaRecojo(this.campana, archivoHijo).subscribe(
            () => {
          
                let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
                  initialState : {
                    mensaje: "La guía de recojo de la campaña se adjuntó correctamente"
                  }
                });
                this.listarCampanasPorRecojer();
              },
              error => {
                  console.log("hola")
              }
        )
    });

  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;
  }

}
