import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteUtdComponent } from './reporte-utd.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [ReporteUtdComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule
  ]
})
export class ReporteUtdModule { }
