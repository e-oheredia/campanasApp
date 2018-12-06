import { AccionRestosProveedor } from './../model/accionrestosproveedor.model';

import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';


@Injectable()
export class AccionRestosProveedorService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ACCION_RESTOS_PROVEEDOR_URL;

    constructor(private requester: RequesterService) {}
    

    listarAll(): Observable<AccionRestosProveedor[]>{
        return this.requester.get<AccionRestosProveedor[]>(this.REQUEST_URL, {});
    }    

}   