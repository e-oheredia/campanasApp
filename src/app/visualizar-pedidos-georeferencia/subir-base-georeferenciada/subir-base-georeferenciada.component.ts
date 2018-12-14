import { Component, OnInit } from '@angular/core';
import { Campana } from '../../model/campana.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ItemCampana } from './../../model/itemcampana.model';
import { CampanaService } from '../../services/campana.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../../services/utils.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ItemCampanaService } from './../../services/itemcampana.service';
import { AppSettings } from './../../settings/app.settings';


@Component({
  selector: 'app-subir-base-georeferenciada',
  templateUrl: './subir-base-georeferenciada.component.html',
  styleUrls: ['./subir-base-georeferenciada.component.css']
})
export class SubirBaseGeoreferenciadaComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public utilsService: UtilsService,
    private notifier: NotifierService,
    private itemCampanaService: ItemCampanaService
  ) { }

  campana: Campana;
  dataItemsCampanaCargados: LocalDataSource = new LocalDataSource();
  itemsCampanaCargados: ItemCampana[] = [];
  excelFile: File;
  tableSettings = AppSettings.tableSettings;

  campanaForm: FormGroup;


  columnsItemsCampanaCargados = {
    id: {
      title: 'Id documento'
    },
    razonSocial: {
      title: 'Razón Social'
    },
    nombres: {
      title: 'Nombres'
    },
    apellidoPaterno: {
      title: 'Apellido Paterno'
    },
    apellidoMaterno: {
      title: 'Apellido Materno'
    },
    direccion: {
      title: 'Dirección'
    },   
    distrito: {
      title: 'Distrito'
    },
    provincia: {
      title: 'Provincia'
    },
    departamento: {
      title: 'Departamento'
    },    
    estado :{
      title: 'Estado'
    }

  };

  ngOnInit() {
    this.tableSettings.columns = this.columnsItemsCampanaCargados;
    
    this.campanaForm = new FormGroup({
      'archivoExcel': new FormControl(null)
    })
  }

  subirBase() {

    console.log(this.campana);
  }

  onChangeExcelFile(file: File) {
    if (file == null) {
      this.excelFile = null;
      this.dataItemsCampanaCargados = new LocalDataSource();
      this.itemsCampanaCargados = [];
      return null;
    }
    if (file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      this.excelFile = null;
      this.dataItemsCampanaCargados = new LocalDataSource();
      this.itemsCampanaCargados = [];
      this.notifier.notify('error', 'Error, el archivo debe ser un Excel');
      return null;
    }
    this.excelFile = file;    
    this.importarExcel();
  }

  importarExcel() {
    if (this.excelFile == null) {
      this.dataItemsCampanaCargados = new LocalDataSource();
      this.itemsCampanaCargados = [];
      return null;
    }
    this.mostrarItemsCampanaBase(this.excelFile, this.campana);
  }

  mostrarItemsCampanaBase(file: File, campana : Campana) {
    this.dataItemsCampanaCargados.reset();
    this.itemsCampanaCargados = [];
    this.itemCampanaService.mostrarItemsCampanaBase(file, 0, campana, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.itemsCampanaCargados = data;
        let dataItemsCampanaCargados = [];
        data.forEach(element => {
          dataItemsCampanaCargados.push({
            departamento: element.distrito.provincia.departamento.nombre,
            provincia: element.distrito.provincia.nombre,
            distrito: element.distrito.nombre,
            nombres: element.nombres,
            apellidoPaterno: element.apellidoPaterno,
            apellidoMaterno: element.apellidoMaterno,
            direccion: element.direccion,
            razonSocial: element.razonSocial,
            estado: element.enviable == true ? "Normalizado" : "No distribuible",
            id: element.id
          })
        });
        this.dataItemsCampanaCargados.load(dataItemsCampanaCargados);
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }
}
