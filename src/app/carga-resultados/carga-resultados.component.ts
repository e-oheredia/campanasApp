import { Component, OnInit } from '@angular/core';
import { TituloService } from '../services/titulo.service';
import { CampanaService } from '../services/campana.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { AppSettings } from '../settings/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { Campana } from '../model/campana.model';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TrackingCampanaComponent } from '../modals/tracking-campana/tracking-campana.component';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { ItemCampana } from '../model/itemcampana.model';
import { SubirReporteComponent } from './subir-reporte/subir-reporte.component';
import { RegionService } from '../services/region.service';
import { Region } from '../model/region.model';

@Component({
  selector: 'app-carga-resultados',
  templateUrl: './carga-resultados.component.html',
  styleUrls: ['./carga-resultados.component.css']
})
export class CargaResultadosComponent implements OnInit {

  constructor(
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService,
    private regionService: RegionService,
    private notifier: NotifierService
  ) { }

  settings = AppSettings.tableSettings;
  dataCampanasOperativas: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];
  region: Region[] = [];
  prefijo = AppSettings.PREFIJO;

  ngOnInit() {
    this.tituloService.setTitulo("Carga de Resultados");
    this.generarColumnas();
    this.listarCampanasOperativas();
    this.listarRegiones();
  }

  generarColumnas(){
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
        title: 'Código de campaña'
      },
      nombre: {
        title: 'Nombre de campaña'
      },
      tipoCampana: {
        title: 'Tipo de campaña'
      },
      tipoDestino: {
        title: 'Tido de destino'
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
      ultimaFechaDistribución: {
        title: 'Última fecha de distribución'
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
      buttonSubir: {
        title: 'Subir reporte final',
        type: 'custom',
        renderComponent : ButtonViewComponent,
        onComponentInitFunction: (instance : any) => {
          instance.claseIcono = "fas fa-file-upload",
          instance.pressed.subscribe(row => {
            this.subirReporteFinal(row);
          });
        }
      }
    };
  }

  visualizarSeguimiento(row){
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg'
    });
  }

  listarRegiones(){
    this.regionService.listarAll().subscribe(
      regiones => {
        this.region = regiones;
      }
    );
  }

  listarCampanasOperativas(){
    this.dataCampanasOperativas.reset();
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.DISTRIBUCION_INICIADA).subscribe(
      campanasa => {
        this.campanas = campanasa;
        let dataCampanasOperativas = [];
        campanasa.forEach(
          campana => {

            let ultimaFechaDistribucion = this.regionService.ultimaFechaDistribucion(campana, this.region);
            
            dataCampanasOperativas.push({
              id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
              nombre: campana.nombre,
              tipoCampana: campana.tipoCampana.nombre,
              tipoDestino: campana.tipoDestino.nombre,
              tipoDocumento: campana.tipoDocumento.nombre,
              cantidadLima: this.contarDocumentos(campana.itemsCampana, true, true),
              cantidadProvincia: this.contarDocumentos(campana.itemsCampana, false, true),
              ultimaFechaDistribución: ultimaFechaDistribucion
              
            });
          });
          this.dataCampanasOperativas.load(dataCampanasOperativas);
      }
    )

  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false) : number{
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;
  }

  descargarBasesOperativas(row: any){
    this.campanaService.exportarItemsCampanaDistribucion(this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)));
  }

  subirReporteFinal(row){
    let campana = this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id));
    let bsModalRef: BsModalRef = this.modalService.show(SubirReporteComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id)),
        title: 'Subir Reporte Final',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static",
    });

    this.modalService.onHide.subscribe(
      () => {
        this.listarCampanasOperativas();
      })
  }


}
