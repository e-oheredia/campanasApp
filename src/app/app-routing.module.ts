import { VerificarGuiaComponent } from './verificar-guia/verificar-guia.component';
import { SolicitudMuestraComponent } from './solicitud-muestra/solicitud-muestra.component';
import { RecotizacionCampanaComponent } from './recotizacion-campana/recotizacion-campana.component';
import { SeleccionProveedorComponent } from './seleccion-proveedor/seleccion-proveedor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerarCampanaDocumentoComponent } from './generar-campana/generar-campana-documento/generar-campana-documento.component';
import { ConfirmacionGeoComponent } from './confirmacion-geo/confirmacion-geo.component';
import { VisualizarPedidosGeoreferenciaComponent } from './visualizar-pedidos-georeferencia/visualizar-pedidos-georeferencia.component';
import { VerificarConformidadComponent } from './verificar-conformidad/verificar-conformidad.component';
import { ConfirmacionCotizacionComponent } from './confirmacion-cotizacion/confirmacion-cotizacion.component';
import { ImpresionCampanaComponent } from './impresion-campana/impresion-campana.component';
import { SubirMuestraComponent } from './subir-muestra/subir-muestra.component';
import { RecojoCampanaComponent } from './recojo-campana/recojo-campana.component';
import { CargaResultadosComponent } from './carga-resultados/carga-resultados.component';
import { RecepcionOperativaComponent } from './recepcion-operativa/recepcion-operativa.component';
import { ReporteUtdComponent } from './reporte-utd/reporte-utd.component';


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
  },
  {
    path: 'verificar-conformidad',
    component: VerificarConformidadComponent
  },
  {
    path: 'solicitud-muestra',
    component: SolicitudMuestraComponent
  },
  {
    path: 'subir-muestra',
    component: SubirMuestraComponent
  },
  {
    path: 'impresion-campana',
    component: ImpresionCampanaComponent
  },
  {
    path: 'recojo-campana',
    component: RecojoCampanaComponent
  },
  {
    path: 'verificar-guia',
    component: VerificarGuiaComponent
  },
  {
    path: 'cargar-resultados',
    component: CargaResultadosComponent
  },
  {
    path: 'recepcion-operativa',
    component: RecepcionOperativaComponent
  },
  {
    path: 'reporte-utd',
    component: ReporteUtdComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
