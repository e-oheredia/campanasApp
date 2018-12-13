import { NotifierModule } from 'angular-notifier';
import { LayoutModule } from './layout/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeleccionProveedorModule } from './seleccion-proveedor/seleccion-proveedor.module';

import { GenerarCampanaModule } from './generar-campana/generar-campana.module';
import { ConfirmacionGeoModule } from './confirmacion-geo/confirmacion-geo.module';
import { VisualizarPedidosGeoreferenciaModule } from './visualizar-pedidos-georeferencia/visualizar-pedidos-georeferencia.module';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component'


@NgModule({
  declarations: [
    AppComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    GenerarCampanaModule,
    SeleccionProveedorModule, 
    NotifierModule,
    ConfirmacionGeoModule,
    VisualizarPedidosGeoreferenciaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
