import { RequesterService } from './../services/requester.service';
import { MenuService } from './../services/menu.service';
import { BrowserStorageService } from './../services/browserstorage.service';
import { AuthInterceptor } from './../services/interceptors/auth-interceptor';
import { AppRoutingModule } from './../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { TreeViewComponent } from './header/tree-view/tree-view.component';
import { LocalStorageModule } from '../../../node_modules/angular-2-local-storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '../../../node_modules/@angular/common/http';
import { PlazoService } from '../services/plazo.service';

@NgModule({
  declarations: [
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
    HttpClientModule
  ],
  exports: [
    HeaderComponent,
    AppRoutingModule
  ],
  providers: [
    AuthInterceptor,
    BrowserStorageService,
    MenuService,
    RequesterService,
    PlazoService,
    {provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true}, 
  ]
})
export class LayoutModule { }
