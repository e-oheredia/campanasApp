import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecojoCampanaComponent } from './recojo-campana.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [RecojoCampanaComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule
  ]
})
export class RecojoCampanaModule { }
