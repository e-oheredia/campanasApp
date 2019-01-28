import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionOperativaComponent } from './recepcion-operativa.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [RecepcionOperativaComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule
  ]
})
export class RecepcionOperativaModule { }
