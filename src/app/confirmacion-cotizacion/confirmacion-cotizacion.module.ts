import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//ts. dentro de este componente.
import { ConfirmacionCotizacionComponent } from './confirmacion-cotizacion.component';
//
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TableManagementModule } from '../table-management/table-management.module';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { AdjuntarCorreoComponent } from './adjuntar-correo/adjuntar-correo.component';

@NgModule({
    imports: [
      CommonModule, 
      TableManagementModule,
      Ng2SmartTableModule,
      ReactiveFormsModule, 
      FormsModule      
    ],
    declarations: [
      ConfirmacionCotizacionComponent,
      AdjuntarCorreoComponent
    ],
    entryComponents: [
      ButtonViewComponent,
      ConfirmacionCotizacionComponent,
      AdjuntarCorreoComponent,
      ConfirmModalComponent
    ]
  })

  export class ConfirmacionCotizacionModule {}