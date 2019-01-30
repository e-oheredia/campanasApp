import { ButtonViewComponent } from './../table-management/button-view/button-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableManagementModule } from './../table-management/table-management.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificarGuiaComponent } from './verificar-guia.component';
import { AprobarGuiaComponent } from './aprobar-guia/aprobar-guia.component';

@NgModule({
  declarations: [VerificarGuiaComponent, AprobarGuiaComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule, 
    TableManagementModule,
    ReactiveFormsModule,
    FormsModule,
  ], 
  entryComponents: [
    VerificarGuiaComponent,
    ButtonViewComponent,
    AprobarGuiaComponent
  ]

})
export class VerificarGuiaModule { }
