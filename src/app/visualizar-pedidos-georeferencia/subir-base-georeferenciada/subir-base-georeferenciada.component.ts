import { MensajeExitoComponent } from './../../modals/mensaje-exito/mensaje-exito.component';
import { Component, OnInit } from '@angular/core';
import { Campana } from '../../model/campana.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
    private itemCampanaService: ItemCampanaService,
    private campanaService: CampanaService, 
    private modalService: BsModalService
  ) { }

  campana: Campana;
  dataItemsCampanaCargados: LocalDataSource = new LocalDataSource();
  itemsCampanaCargados: ItemCampana[] = [];
  excelFile: File;
  tableSettings = AppSettings.tableSettings;
  prefijo = AppSettings.PREFIJO;

  campanaForm: FormGroup;


  columnsItemsCampanaCargados = {    
    id: {
      title: 'Id documento'
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
        
        
        let dataItemsCampanaCargados = [];
        data.forEach(element => {
          
         
            dataItemsCampanaCargados.push({
              departamento: element.distrito.provincia.departamento.nombre,
              provincia: element.distrito.provincia.nombre,
              distrito: element.distrito.nombre,           
              direccion: element.direccion,            
              estado: element.enviable == true ? "Normalizado" : "No distribuible",
              id: element.id
            })
         
            this.campana.itemsCampana.find(x=> x.id == element.id).enviable = element.enviable;
          
          
        });

        this.itemsCampanaCargados = dataItemsCampanaCargados;
        this.dataItemsCampanaCargados.load(dataItemsCampanaCargados);
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });

  }

  onSubmit(form: any){

    if(this.itemsCampanaCargados.length == 0){
      this.notifier.notify('error', "Debe seleccionar un archivo");
      return;
    } 

    this.campanaService.georeferenciarBase(this.campana).subscribe(
      () => {        
        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState : {
            mensaje: "La base fue georeferenciada y enviada al usuario "
          }
        });  
        this.bsModalRef.hide();      
      }
    )    
  }

}
