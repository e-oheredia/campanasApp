import { SeleccionProveedorComponent } from './seleccion-proveedor/seleccion-proveedor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'seleccion-proveedor',
    component: SeleccionProveedorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
