import { SolicitudMuestraModule } from './solicitud-muestra/solicitud-muestra.module';
import { RecotizacionCampanaModule } from './recotizacion-campana/recotizacion-campana.module';
import { NotifierModule } from 'angular-notifier';
import { LayoutModule } from './layout/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { MensajeExitoComponent } from './modals/mensaje-exito/mensaje-exito.component'

import { GenerarCampanaModule } from './generar-campana/generar-campana.module';
import { SeleccionProveedorModule } from './seleccion-proveedor/seleccion-proveedor.module';
import { ConfirmacionGeoModule } from './confirmacion-geo/confirmacion-geo.module';
import { ConfirmacionCotizacionModule } from './confirmacion-cotizacion/confirmacion-cotizacion.module';
import { VerificarConformidadModule } from './verificar-conformidad/verificar-conformidad.module';
import { VisualizarPedidosGeoreferenciaModule } from './visualizar-pedidos-georeferencia/visualizar-pedidos-georeferencia.module';

import { ImpresionCampanaModule } from './impresion-campana/impresion-campana.module';

import { SubirMuestraModule } from './subir-muestra/subir-muestra.module';
import {RecojoCampanaModule} from './recojo-campana/recojo-campana.module';

import {RecepcionOperativaModule} from './recepcion-operativa/recepcion-operativa.module';


@NgModule({
  declarations: [
    AppComponent,
    ConfirmModalComponent,
    MensajeExitoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    GenerarCampanaModule,
    SeleccionProveedorModule, 
    NotifierModule,
    ConfirmacionGeoModule,
    VisualizarPedidosGeoreferenciaModule, 
    RecotizacionCampanaModule,
    VerificarConformidadModule,
    ConfirmacionCotizacionModule,
    ImpresionCampanaModule,
    SolicitudMuestraModule,
    SubirMuestraModule,
    RecojoCampanaModule,
    RecepcionOperativaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
