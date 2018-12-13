import { Campana } from '../model/campana.model';
import { Component, OnInit } from '@angular/core';
import { TituloService } from '../services/titulo.service';
import { CampanaService } from '../services/campana.service';
import { AppSettings } from '../settings/app.settings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-visualizar-pedidos-georeferencia',
  templateUrl: './visualizar-pedidos-georeferencia.component.html',
  styleUrls: ['./visualizar-pedidos-georeferencia.component.css']
})
export class VisualizarPedidosGeoreferenciaComponent implements OnInit {

  constructor(
    private tituloService: TituloService, 
    private campanaService: CampanaService, 
    private modalService: BsModalService
  ) { }

  settings = AppSettings.tableSettings;
  dataCampanasCreadas: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];

  estadosCampana : number[] = [EstadoCampanaEnum.ASIGNADA,EstadoCampanaEnum.GEOREFERENCIADA_Y_MODIFICADA];

  ngOnInit() {
    this.tituloService.setTitulo("Selección de Proveedor");
    this.settings.columns = {
      id: {
        title: 'Número de Campaña'
      },     
      nombre: {
        title: 'Nombre'
      },
      tipoCampana: {
        title: 'Tipo de Campaña'
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
      estado : {
        title: 'Estado'
      },
      button: {
        title: 'Descargar Base',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-hand-pointer";
          instance.pressed.subscribe(row => {
            this.descargarBase(row);
          });
        }
      },
      
    };
    this.listarCampanasCreadas();
  }

  descargarBase(row) {
    this.campanaService.exportarItemsCampanaPorGeoReferenciar(this.campanas.find(campana => campana.id == row.id));
  }

  listarCampanasCreadas() {
    this.dataCampanasCreadas.reset();
    this.campanas = [];
    this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasCreadas = [];
        campanas.forEach(campana => {
          dataCampanasCreadas.push({
            id: campana.id,
            nombre: campana.nombre,
            tipoCampana: campana.tipoCampana.nombre,
            tipoDocumento: campana.tipoDocumento.nombre,            
            cantidadLima: campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
            cantidadProvincia: campana.itemsCampana.length - campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
            estado: this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.nombre
          });
        });
        this.dataCampanasCreadas.load(dataCampanasCreadas);
      }

    )
  }

}
