import { ButtonViewComponent } from './../table-management/button-view/button-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudImpresionComponent } from './solicitud-impresion.component';

@NgModule({
  declarations: [SolicitudImpresionComponent],
  imports: [
    CommonModule
  ], 
  entryComponents: [
    ButtonViewComponent,
    
  ]
})
export class SolicitudImpresionModule { }
