import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableManagementModule } from '../table-management/table-management.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//componente.ts de este componente
import { ImpresionCampanaComponent } from './impresion-campana.component';
import { DatosRecojoComponent } from './datos-recojo/datos-recojo.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [ImpresionCampanaComponent, DatosRecojoComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule, 
    TableManagementModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents:[
    ButtonViewComponent,
    ImpresionCampanaComponent,
    DatosRecojoComponent,
    ConfirmModalComponent
  ]
})
export class ImpresionCampanaModule { }