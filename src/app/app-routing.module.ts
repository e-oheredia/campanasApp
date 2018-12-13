import { RecotizacionCampanaComponent } from './recotizacion-campana/recotizacion-campana.component';
import { SeleccionProveedorComponent } from './seleccion-proveedor/seleccion-proveedor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerarCampanaDocumentoComponent } from './generar-campana/generar-campana-documento/generar-campana-documento.component';
import { VisualizarPedidosGeoreferenciaComponent } from './visualizar-pedidos-georeferencia/visualizar-pedidos-georeferencia.component';

const routes: Routes = [
  {
    path: 'seleccion-proveedor',
    component: SeleccionProveedorComponent
  },
  {
    path: 'ingresar-campana',
    component: GenerarCampanaDocumentoComponent
  },
  {
    path: 'visualizar-pedidos-georeferencia',
    component: VisualizarPedidosGeoreferenciaComponent
  },
  {
    path: 'recotizacion-campana',
    component: RecotizacionCampanaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
