import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ItemCampana } from 'src/app/model/itemcampana.model';
import { NotifierService } from 'angular-notifier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemCampanaService } from 'src/app/services/itemcampana.service';
import { CampanaService } from 'src/app/services/campana.service';
import { Campana } from 'src/app/model/campana.model';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';
import { UtilsService } from 'src/app/services/utils.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-subir-reporte',
  templateUrl: './subir-reporte.component.html',
  styleUrls: ['./subir-reporte.component.css']
})
export class SubirReporteComponent implements OnInit {

  constructor(
    private bsModalRef : BsModalRef,
    private utilsService: UtilsService,
    private notifier : NotifierService,
    private itemCampanaService : ItemCampanaService,
    private modalService: BsModalService,
    private campanaService: CampanaService,
  ) { }

  campana: Campana;
  excelFile: File;
  campanaForm: FormGroup;
  adjuntado: boolean = false;

  ngOnInit() {
    this.campanaForm = new FormGroup({
      'reporteExcel': new FormControl(null)
    })
  }



  onChangeExcelFile(file: File){
    if(file == null){
      this.excelFile = null;
      return null;
    }
    if(file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      this.excelFile = null;
      this.notifier.notify('error','Error, el archivo debe ser un Excel');
      return null;
    }
    this.excelFile = file;
    this.importarExcel();
  }



  importarExcel(){
    if(this.excelFile == null){

      return null;
    }
    this.mostrarItemsReporte(this.excelFile, this.campana);
  }



  mostrarItemsReporte(file: File, campana: Campana){
    

    this.itemCampanaService.mostrarItemsReporte(file, 0, campana, (data) => {
      if(this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)){

        data.forEach(element => {
         let itemcampana = this.campana.itemsCampana.find(x => x.id == element.id);
         itemcampana.estadoItemCampana = element.estadoItemCampana;
         itemcampana.detalle = element.detalle;
        });
        this.adjuntado = true;
        return;
      }
      this.notifier.notify('error', data.mensaje);
      this.adjuntado = false;
    });
  }





  onSubmit(form: any){
    if(!this.adjuntado){
      this.notifier.notify('error','Debe seleccionar un archivoo');
      return;
    }

    this.campanaService.subirReporte(this.campana).subscribe(
      () => {
        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState: {
            mensaje: "El reporte fue subido correctamente"
          }
        });
        this.bsModalRef.hide();
      }
    )
  }

}
