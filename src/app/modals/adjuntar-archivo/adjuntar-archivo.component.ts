import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Campana } from '../../model/campana.model';
import { ItemCampana } from './../../model/itemcampana.model';
import { AppSettings } from './../../settings/app.settings';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../../services/utils.service';
import { ItemCampanaService } from './../../services/itemcampana.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CampanaService } from '../../services/campana.service';

@Component({
  selector: 'app-adjuntar-archivo',
  templateUrl: './adjuntar-archivo.component.html',
  styleUrls: ['./adjuntar-archivo.component.css']
})
export class AdjuntarArchivoComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public utilsService: UtilsService,
    private notifier: NotifierService,
    private itemCampanaService: ItemCampanaService,
    private modalService: BsModalService,
    private campanaService: CampanaService, 
    ) { }


  campana: Campana;
  dataItemsCampanaCargados: LocalDataSource = new LocalDataSource();
  itemsCampanaCargados: ItemCampana[] = [];
  excelFile: File;
  tableSettings = AppSettings.tableSettings;
  prefijo = AppSettings.PREFIJO;
  campanaForm: FormGroup;

  
  ngOnInit() {
    // this.tableSettings.columns = this.columnsItemsCampanaCargados;
    this.campanaForm = new FormGroup({
      'archivoExcel': new FormControl(null)
    })
  }

  archivo: File;
  archivosPermitidos: string;

  mensaje: string;
  titulo: string;
}
