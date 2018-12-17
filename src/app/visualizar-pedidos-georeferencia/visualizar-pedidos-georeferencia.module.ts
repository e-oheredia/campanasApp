import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableManagementModule } from '../table-management/table-management.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisualizarPedidosGeoreferenciaComponent } from './visualizar-pedidos-georeferencia.component';
import { SubirBaseGeoreferenciadaComponent } from './subir-base-georeferenciada/subir-base-georeferenciada.component';

@NgModule({
  declarations: [VisualizarPedidosGeoreferenciaComponent, SubirBaseGeoreferenciadaComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule, 
    TableManagementModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  entryComponents:[
    ButtonViewComponent,
    SubirBaseGeoreferenciadaComponent
    
  ]
})
export class VisualizarPedidosGeoreferenciaModule { }
