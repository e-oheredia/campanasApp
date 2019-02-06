import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { Campana } from '../model/campana.model';
import { AppSettings } from '../settings/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TrackingCampanaComponent } from '../modals/tracking-campana/tracking-campana.component';
import { CampanaService } from '../services/campana.service';
import { ItemCampana } from '../model/itemcampana.model';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { TituloService } from '../services/titulo.service';
import { UtilsService } from '../services/utils.service';
import * as moment from 'moment-timezone';
import { NotifierService } from 'angular-notifier';
import { Region} from '../model/region.model';
import { RegionService } from '../services/region.service';

@Component({
  selector: 'app-reporte-utd',
  templateUrl: './reporte-utd.component.html',
  styleUrls: ['./reporte-utd.component.css']
})
export class ReporteUtdComponent implements OnInit {

  reporteForm: FormGroup;
  campanas: Campana[] = [];
  region: Region[] = [];
  campana: Campana;
  settings = AppSettings.tableSettings;
  dataCampanas: LocalDataSource = new LocalDataSource();
  prefijo = AppSettings.PREFIJO;

  estadosCampana: number[] = [

    EstadoCampanaEnum.MUESTRA_SOLICITADA,
    EstadoCampanaEnum.MUESTRA_DENEGADA];

  constructor(
    private modalService: BsModalService,
    private campanaService: CampanaService,
    private tituloService: TituloService,
    public utilsService: UtilsService,
    private notifier: NotifierService,
    private regionService: RegionService,

  ) { }

  ngOnInit() {
    this.tituloService.setTitulo("Seguimiento de campaña");
    this.listarRegiones();
    this.reporteForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
    });
    this.generarColumnas();
  }

  listarRegiones(){
    this.regionService.listarAll().subscribe(
      regiones =>{
        this.region = regiones;
      }
    );
  }
  generarColumnas() {
    this.settings.columns = {
      
      id: {
        title: 'Código de campaña'
      },
      nombre: {
        title: 'Nombre de campaña'
      },
      solicitante: {
        title: 'Usuario solicitante'
      },
      areaSolicitante: {
        title: 'Área solicitante'
      },
      proveedor: {
        title: 'Proveedor'
      },
      tipoCampana: {
        title: 'Tipo de campaña'
      },
      devolucionRezago: {
        title: 'Devolución de rezagos'
      },
      devolucionCargo: {
        title: 'Devolución de cargos'
      },
      cantidadTotal: {
        title: 'Cantidad total'
      },
      estadoActualCampana: {
        title: 'Estado actual de la campaña'
      },
      fechaUltimoEstado: {
        title: 'Fecha del último estado'
      },
      fechaReporteProgramado: {
        title: 'Fecha reporte programado'
      },
      fechaReporteReal: {
        title: 'Fecha reporte real'
      },

    };
  }
  //reemplazar el service por el que implemente Cri
  MostrarReportes(fechaIni: Date, fechaFin: Date) {

    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.reporteForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.reporteForm.controls['fechaFin'].value)) {

      let fechaIniDate = new Date(fechaIni);
      let fechaFinDate = new Date(fechaFin);
      fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
      fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());


      this.campanaService.generarReporteUTD(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD'), EstadoCampanaEnum.CREADA).subscribe(
        campanas => {
          this.campanas = campanas;
          let dataCampanas = [];
          campanas.forEach(campana => {

            let campana_u = this.campanaService.getUltimoSeguimientoCampana(campana);
            let proveedor_nombre = '';
            let tipoCampana_nombre = '';

            if (!this.utilsService.isUndefinedOrNullOrEmpty(campana.proveedor)) {
              proveedor_nombre = campana.proveedor.nombre;
            }

            if (!this.utilsService.isUndefinedOrNullOrEmpty(campana.tipoCampana)) {
              tipoCampana_nombre = campana.tipoCampana.nombre;
            }

            dataCampanas.push({
              id: this.campanaService.codigoAutogenerado(campana.id, this.prefijo.DOCUMENTO),
              nombre: campana.nombre,
              solicitante: campana.buzon.nombre,
              areaSolicitante: campana.buzon.area.nombre,
              proveedor: proveedor_nombre,
              tipoCampana: tipoCampana_nombre,
              devolucionRezago: campana.accionRestosRezagosCampana ? "SI" : "NO",
              devolucionCargo: campana.accionRestosCargosCampana ? "SI" : "NO",
              cantidadTotal: this.cantidadTotal(campana.itemsCampana),
              estadoActualCampana: campana_u.estadoCampana.nombre,
              fechaUltimoEstado: campana_u.fecha,
              fechaReporteProgramado: '',
              fechaReporteReal: ''
            });
          });
          this.generarColumnas();
          this.dataCampanas.load(dataCampanas);
        }
      )
    }
    //console.log(this.dataCampanas);

  }


  exportar(campana: Campana){
    this.campanaService.exportarReporte(this.campanas,this.region);
  }

  cantidadTotal(documentos: ItemCampana[], normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.enviable || !normalizado)).length;
  }

}
