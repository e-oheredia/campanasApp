import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargaResultadosComponent } from './carga-resultados.component';
import { SubirReporteComponent } from './subir-reporte/subir-reporte.component';
import { TableManagementModule } from '../table-management/table-management.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [CargaResultadosComponent, SubirReporteComponent],
  imports: [
    CommonModule,
    TableManagementModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents:[
    ButtonViewComponent,
    CargaResultadosComponent,
    SubirReporteComponent,
    ConfirmModalComponent
  ]
})
export class CargaResultadosModule { }
