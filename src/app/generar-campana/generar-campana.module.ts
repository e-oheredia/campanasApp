import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//ts. dentro de este componente.
import { GenerarCampanaDocumentoComponent } from './generar-campana-documento/generar-campana-documento.component';
import { DatosBuzonComponent } from './datos-buzon/datos-buzon.component';


@NgModule({
    imports: [
      CommonModule, 
      ReactiveFormsModule, 
      FormsModule      
    ],
    declarations: [
      GenerarCampanaDocumentoComponent,
      DatosBuzonComponent
    ], 
    exports: [
      GenerarCampanaDocumentoComponent
    ],
    entryComponents: [
    ]
  })

  export class GenerarCampanaModule {}