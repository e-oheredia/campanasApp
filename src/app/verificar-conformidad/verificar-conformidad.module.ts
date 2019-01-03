import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableManagementModule } from '../table-management/table-management.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerificarConformidadComponent } from './verificar-conformidad.component';

@NgModule({
  declarations: [VerificarConformidadComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule, 
    TableManagementModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  entryComponents:[
    ButtonViewComponent
    
  ]
})
export class VerificarConformidadModule { }
