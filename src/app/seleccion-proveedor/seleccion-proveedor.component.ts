import { Campana } from '../model/campana.model';
import { SeleccionarProveedorComponent } from './seleccionar-proveedor/seleccionar-proveedor.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from '../services/campana.service';
import { AppSettings } from '../settings/app.settings';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TituloService } from '../services/titulo.service';
import { Component, OnInit } from '@angular/core';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-seleccion-proveedor',
  templateUrl: './seleccion-proveedor.component.html',
  styleUrls: ['./seleccion-proveedor.component.css']
})
export class SeleccionProveedorComponent implements OnInit {

  constructor(
    private tituloService: TituloService, 
    private campanaService: CampanaService, 
    private modalService: BsModalService
  ) { }

  settings = AppSettings.tableSettings;
  dataCampanasCreadas: LocalDataSource = new LocalDataSource();
  campanas: Campana[] = [];


  ngOnInit() {
    this.tituloService.setTitulo("Selección de Proveedor");
    this.settings.columns = {
      id: {
        title: 'Número de Campaña'
      },
      nombre: {
        title: 'Nombre'
      },
      solicitante: {
        title: 'Solicitante'
      },
      regulatorio: {
        title: 'Regulatorio'
      },
      tipoDocumento: {
        title: 'Tipo de Documento'
      },
      tipoDestino: {
        title: 'Tipo de Destino'
      },
      cantidadLima: {
        title: 'Cantidad Lima'
      },
      cantidadProvincia: {
        title: 'Cantidad Provincia'
      },
      button: {
        title: 'Asignar Proveedor',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-hand-pointer";
          instance.pressed.subscribe(row => {
            this.asignarProveedor(row);
          });
        }
      },
    };
    this.listarCampanasCreadas();
  }

  asignarProveedor(row) {
    let bsModalRef: BsModalRef = this.modalService.show(SeleccionarProveedorComponent, {
      initialState: {
        campana: this.campanas.find(campana => campana.id == row.id)
      },
      class: 'modal-lg'
    });
    
    this.modalService.onHide.subscribe(
      () => this.listarCampanasCreadas()
    )
  }

  listarCampanasCreadas() {
    this.dataCampanasCreadas.reset();
    this.campanas = [];
    this.campanaService.listarCampanasPorEstado(EstadoCampanaEnum.CREADO).subscribe(
      campanas => {
        this.campanas = campanas;
        let dataCampanasCreadas = [];
        campanas.forEach(campana => {
          dataCampanasCreadas.push({
            id: campana.id,
            nombre: campana.nombre,
            solicitante: campana.buzon.nombre,
            regulatorio: campana.regulatorio ? 'Sí':'No',
            tipoDocumento: campana.tipoDocumento.nombre,
            tipoDestino: campana.tipoDestino.nombre,
            cantidadLima: campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
            cantidadProvincia: campana.itemsCampana.length - campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length
          });
        });
        this.dataCampanasCreadas.load(dataCampanasCreadas);
      }

    )
  }

}
