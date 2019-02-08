import { MensajeExitoComponent } from './../../modals/mensaje-exito/mensaje-exito.component';
import { Component, OnInit } from '@angular/core';
import { Campana } from '../../model/campana.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemCampana } from './../../model/itemcampana.model';
import { CampanaService } from '../../services/campana.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../../services/utils.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ItemCampanaService } from './../../services/itemcampana.service';
import { AppSettings } from './../../settings/app.settings';

@Component({
  selector: 'app-modificar-base',
  templateUrl: './modificar-base.component.html',
  styleUrls: ['./modificar-base.component.css']
})
export class ModificarBaseComponent implements OnInit {

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

  columnsItemsCampanaCargados = {    
    correlativo: {
      title: 'Correlativo'
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
    this.mostrarItemsPorModificar(this.excelFile, this.campana);
  }

  mostrarItemsPorModificar(file: File, campana : Campana) {
    this.dataItemsCampanaCargados.reset();
    this.itemsCampanaCargados = [];
    
    this.itemCampanaService.mostrarItemsPorModificar(file, 0, campana, (data) => {

      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {        
        
        let dataItemsCampanaCargados = [];
        data.forEach(element => {          
         
            dataItemsCampanaCargados.push({
              departamento: element.distrito.provincia.departamento.nombre,
              provincia: element.distrito.provincia.nombre,
              distrito: element.distrito.nombre,           
              direccion: element.direccion,
              correlativo: element.correlativoBase
            })

            this.campana.itemsCampana.find(x=> x.id == element.id).enviable = false;
            this.campana.itemsCampana.find(x=> x.id == element.id).direccion = element.direccion;
            this.campana.itemsCampana.find(x=> x.id == element.id).distrito = element.distrito;
                   
          
        });

        this.itemsCampanaCargados = dataItemsCampanaCargados;
        //this.dataItemsCampanaCargados.load(dataItemsCampanaCargados);
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

    this.campanaService.modificarBase(this.campana).subscribe(
      () => {
        
        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState : {
            mensaje: "La base fue modificada y enviada a georeferenciar correctamente "
          }
        });
        this.bsModalRef.hide();        
      }
    )    
  }


}
