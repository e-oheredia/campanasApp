import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//ts. dentro de este componente.
import { ModificarBaseComponent } from './modificar-base/modificar-base.component';
import { ConfirmacionGeoComponent } from './confirmacion-geo.component';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TableManagementModule } from '../table-management/table-management.module';

@NgModule({
    imports: [
      CommonModule, 
      TableManagementModule,
      Ng2SmartTableModule,
      ReactiveFormsModule, 
      FormsModule      
    ],
    declarations: [
      ModificarBaseComponent,
      ConfirmacionGeoComponent
    ],
    entryComponents: [
      ButtonViewComponent,
      ConfirmacionGeoComponent
    ]
  })

  export class ConfirmacionGeoModule {}