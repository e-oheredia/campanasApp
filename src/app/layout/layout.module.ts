import { UtilsService } from './../services/utils.service';
import { ItemCampanaService } from './../services/itemcampana.service';
import { DistritoService } from './../services/distrito.service';
import { DepartamentoService } from './../services/departamento.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BuzonService } from '../services/buzon.service';
import { EmpleadoService } from '../services/empleado.service';
import { PaqueteHabilitadoService } from '../services/paquetehabilitado.service';
import { ProveedorService } from '../services/proveedor.service';
import { TipoCampanaService } from '../services/tipocampana.service';
import { CampanaService } from '../services/campana.service';
import { RequesterService } from '../services/requester.service';
import { MenuService } from '../services/menu.service';
import { BrowserStorageService } from '../services/browserstorage.service';
import { AuthInterceptor } from '../services/interceptors/auth-interceptor';
import { AppRoutingModule } from '../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { TreeViewComponent } from './header/tree-view/tree-view.component';
import { PlazoService } from '../services/plazo.service';
import { TituloComponent } from './titulo/titulo.component';
import { TituloService } from '../services/titulo.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NotifierModule } from 'angular-notifier';
import { TipoDocumentoService } from '../services/tipodocumento.service';
import { TipoDestinoService } from '../services/tipodestino.service';
import { TipoAgrupadoService } from '../services/tipoagrupado.service';
import { AccionRestosProveedorService } from '../services/accionrestosproveedor.service';
import { ProvinciaService } from '../services/provincia.service';
import { ReadExcelService } from '../services/readexcel.service';
import { WriteExcelService } from '../services/write-excel.service';

@NgModule({
  declarations: [
    TituloComponent,
    HeaderComponent,
    TreeViewComponent    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    LocalStorageModule.withConfig({
      prefix: '',
      storageType: 'localStorage'
    }),
    HttpClientModule,
    ModalModule.forRoot(),
    NotifierModule
  ],
  exports: [
    HeaderComponent,
    AppRoutingModule, 
    TituloComponent
  ],
  providers: [
    AuthInterceptor,
    BrowserStorageService,
    MenuService,
    RequesterService,
    PlazoService,
    TipoDocumentoService,
    TipoDestinoService,
    PaqueteHabilitadoService,
    TipoAgrupadoService,
    AccionRestosProveedorService,
    {provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true}, 
    TituloService, 
    CampanaService,
    TipoCampanaService,
    ProveedorService,
    PaqueteHabilitadoService, 
    EmpleadoService, 
    BuzonService, 
    DepartamentoService, 
    ProvinciaService,
    DistritoService,
    ItemCampanaService,
    UtilsService,
    ReadExcelService,
    ItemCampanaService,
    WriteExcelService
  ]
})
export class LayoutModule { }
