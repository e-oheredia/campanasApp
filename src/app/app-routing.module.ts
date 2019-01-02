import { RecotizacionCampanaComponent } from './recotizacion-campana/recotizacion-campana.component';
import { SeleccionProveedorComponent } from './seleccion-proveedor/seleccion-proveedor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerarCampanaDocumentoComponent } from './generar-campana/generar-campana-documento/generar-campana-documento.component';
import { ConfirmacionGeoComponent } from './confirmacion-geo/confirmacion-geo.component';
import { VisualizarPedidosGeoreferenciaComponent } from './visualizar-pedidos-georeferencia/visualizar-pedidos-georeferencia.component';
import { ConfirmacionCotizacionComponent } from './confirmacion-cotizacion/confirmacion-cotizacion.component';

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
    path: 'confirmar-geo',
    component: ConfirmacionGeoComponent
  },
  {
    path: 'visualizar-pedidos-georeferencia',
    component: VisualizarPedidosGeoreferenciaComponent
  },
  {
    path: 'recotizacion-campana',
    component: RecotizacionCampanaComponent
  },
  {
    path: 'confirmacion-cotizacion',
    component: ConfirmacionCotizacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
