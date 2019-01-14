import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeleccionProveedorComponent } from './seleccion-proveedor.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableManagementModule } from '../table-management/table-management.module';
import { SeleccionarProveedorComponent } from './seleccionar-proveedor/seleccionar-proveedor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  declarations: [SeleccionProveedorComponent, SeleccionarProveedorComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule, 
    TableManagementModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyMaskModule
  ], 
  entryComponents:[
    ButtonViewComponent, 
    SeleccionarProveedorComponent
  ]
})
export class SeleccionProveedorModule { }
