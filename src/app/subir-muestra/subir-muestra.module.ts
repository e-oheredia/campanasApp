import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubirMuestraComponent } from './subir-muestra.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [SubirMuestraComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule
  ]
})
export class SubirMuestraModule { }
