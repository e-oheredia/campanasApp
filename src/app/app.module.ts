import { LayoutModule } from './layout/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GenerarCampanaModule } from './generar-campana/generar-campana.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    LayoutModule,
    GenerarCampanaModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
