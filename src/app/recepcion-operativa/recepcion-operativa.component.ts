import { MensajeExitoComponent } from '../modals/mensaje-exito/mensaje-exito.component';
import { TrackingCampanaComponent } from '../modals/tracking-campana/tracking-campana.component';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TituloService } from '../services/titulo.service';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../settings/app.settings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from '../services/campana.service';
import { RegionService } from '../services/region.service';
import { Campana } from '../model/campana.model';
import { Component, OnInit } from '@angular/core';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { ItemCampana } from '../model/itemcampana.model';
import { UtilsService } from '../services/utils.service';
import { Proveedor } from '../model/proveedor.model';
import { ProveedorImpresion } from '../model/proveedorimpresion.model';
import * as moment from 'moment-timezone';
import { AdjuntarArchivoComponent } from '../modals/adjuntar-archivo/adjuntar-archivo.component';
import { TipoHabilitado} from '../model/tipohabilitado.model';
import { Region} from '../model/region.model';
import { ItemCampanaService } from  '../services/itemcampana.service';

@Component({
  selector: 'app-recepcion-operativa',
  templateUrl: './recepcion-operativa.component.html',
  styleUrls: ['./recepcion-operativa.component.css']
})
export class RecepcionOperativaComponent implements OnInit {

  constructor(
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService,
    private regionService: RegionService,
    private itemCampanaService: ItemCampanaService,
  ) { }

  campanas: Campana[] = [];
  campana: Campana;
  region: Region[] = [];
  settings = AppSettings.tableSettings;
  dataCampanas: LocalDataSource = new LocalDataSource();
  prefijo = AppSettings.PREFIJO;
  estadosCampana: number[] = [
    EstadoCampanaEnum.GUIA_ACEPTADA];



  ngOnInit() {
    this.tituloService.setTitulo("Recepción de Operativas");
    this.listarRegiones();
    this.generarColumnas();    
    this.listarCampanasOperativasParaDistribucion();    
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
      fechaHoraOperativa: {
        title: 'Fecha y hora de Operativa'
      },
      inicioDistribucion: {
        title: 'Inicio de Distribución'
      },
      finLima: {
        title: 'Fin de distribución Lima'
      },
      finProvincia: {
        title: 'Fin de distribución Provincia'
      },
      tipoHabilitado: {
        title: 'Tipo de Habilitado'
      },
      tipoEntrega: {
        title: 'Tipo de Entrega'
      },
      buttonDescargarBasesOperativas: {
        title: 'Descargar Base Operativa',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.pressed.subscribe(row => {
            this.descargarBasesOperativas(row);
          });
        }
      },

      buttonIniciarDistribucion: {
        title: 'Iniciar Distribución',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-play";
          instance.pressed.subscribe(row => {
            this.iniciarDistribucion(row);
          });
        }
      }

    };
  }

  listarRegiones(){
    this.regionService.listarAll().subscribe(
      regiones =>{
        this.region = regiones;
      }
    );
  }

  listarCampanasOperativasParaDistribucion() {
    this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanas = [];
        campanas.forEach(campana => {

          let campana_u = this.campanaService.getUltimoSeguimientoCampana(campana);
          let fechaFinLima = this.regionService.fechaFinalLima(campana, this.region);
          let fechaFinProvincia = this.regionService.fechaFinalProvincia(campana, this.region);

          
          
          dataCampanas.push({
            id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadLima: this.contarDocumentos(campana.itemsCampana.filter(x => x.enviable == true), true),
            cantidadProvincia: this.contarDocumentos(campana.itemsCampana.filter(x => x.enviable == true), false),
            fechaHoraOperativa: campana_u.fecha,
            inicioDistribucion: campana.fechaDistribucion.toString().substring(0,10),
            finLima: fechaFinLima,
            finProvincia: fechaFinProvincia,   
            tipoHabilitado: this.verTipoHabilitado(campana.paqueteHabilitado.tiposHabilitado),         
            tipoEntrega:  '',
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

  descargarBasesOperativas(row: any){
    this.campanaService.exportarItemsCampanaDistribucion(this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)));

  }

  iniciarDistribucion(row: any){
    let c = new Campana();
    c.id = this.campanaService.extraerIdAutogenerado(row.id);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Iniciar distribución - Campaña " + row.nombre,
        mensaje: "¿Está seguro de iniciar la distribución de la campaña?",
        textoAceptar: "Si",
        textoCancelar: "No"
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.iniciarDistribucion(c.id).subscribe(
        () => {

          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se ha iniciado la distribución correctamente"
            },
          });
          this.listarCampanasOperativasParaDistribucion();
        },
        error => {
          console.log('holitas')
        }
      )
    });
  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;
  }

  verTipoHabilitado(tipoHabilitado: TipoHabilitado[]){
    let habilitado ="";

    let i = 1;

    tipoHabilitado.forEach(t =>{
      habilitado += " " + t.descripcion;
      if(tipoHabilitado.length > i){
        habilitado +=",";
      }
      i++;
    }    
    )
    return habilitado;
  }
}
