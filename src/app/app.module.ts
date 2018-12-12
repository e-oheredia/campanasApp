import { NotifierModule } from 'angular-notifier';
import { LayoutModule } from './layout/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeleccionProveedorModule } from './seleccion-proveedor/seleccion-proveedor.module';

import { GenerarCampanaModule } from './generar-campana/generar-campana.module';
import { TrackingCampanaComponent } from './modals/tracking-campana/tracking-campana.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    GenerarCampanaModule,
    SeleccionProveedorModule, 
    NotifierModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
