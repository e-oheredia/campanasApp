import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TrackingCampanaComponent } from '../modals/tracking-campana/tracking-campana.component';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudMuestraComponent } from './solicitud-muestra.component';

@NgModule({
  declarations: [SolicitudMuestraComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule
  ], 
  entryComponents: [
  ]
})
export class SolicitudMuestraModule { }
