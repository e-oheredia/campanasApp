import { Proveedor } from './../model/proveedor.model';

import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';


@Injectable()
export class ProveedorService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVEEDOR_URL;

    constructor(
        private requester: RequesterService
    ) {

    }

    listarAll(): Observable<Proveedor[]>{
        return this.requester.get<Proveedor[]>(this.REQUEST_URL, {});
    }    

}   