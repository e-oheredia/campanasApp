import { ItemCampana } from './../../model/itemcampana.model';
import { AppSettings } from './../../settings/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { Campana } from './../../model/campana.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-tracking-campana',
  templateUrl: './tracking-campana.component.html',
  styleUrls: ['./tracking-campana.component.css']
})
export class TrackingCampanaComponent implements OnInit, OnDestroy {

  constructor(
    public bsModalRef: BsModalRef,

  ) { }

  campana: Campana;
  settings2 = Object.assign({}, AppSettings.tableSettings);
  dataSeguimientosCampana: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    this.settings2.columns = {
      estado: {
        title: 'Estado'
      },
      observacion: {
        title: 'Observación'
      },
      fecha: {
        title: 'Fecha'
      },
      responsable: {
        title: 'Responsable'
      }
    };
    this.cargarSeguimientosCampana();
  }

  cargarSeguimientosCampana() {
    this.dataSeguimientosCampana.reset();
    let dataSeguimientosCampana = [];
    this.campana.seguimientosCampana.sort((a,b) => a.id - b.id).forEach(
      seguimientoCampana => {
        dataSeguimientosCampana.push({
          estado: seguimientoCampana.estadoCampana.nombre,
          observacion: seguimientoCampana.observacion,
          fecha: seguimientoCampana.fecha,
          responsable: seguimientoCampana.empleado.nombres
        });
      }
    )
    this.dataSeguimientosCampana.load(dataSeguimientosCampana);
  }

  contarDocumentosDeLima(documentos: ItemCampana[]): number {
    return documentos.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length;    
  }

  ngOnDestroy() {

  }

}
