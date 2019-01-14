import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecotizacionCampanaComponent } from './recotizacion-campana.component';
import { RecotizarCampanaComponent } from './recotizar-campana/recotizar-campana.component';

@NgModule({
  declarations: [RecotizacionCampanaComponent, RecotizarCampanaComponent],
  imports: [
    CommonModule, 
    Ng2SmartTableModule, 
    ReactiveFormsModule,
    CurrencyMaskModule
  ], 
  entryComponents: [
    RecotizarCampanaComponent
  ]
})
export class RecotizacionCampanaModule { }
