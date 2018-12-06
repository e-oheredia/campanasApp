import { PaqueteHabilitado } from '../model/paquetehabilitado.model';

import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';


@Injectable()
export class PaqueteHabilitadoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PAQUETE_HABILITADO_URL;

    constructor(
        private requester: RequesterService
    ) {

    }

    listarAll(): Observable<PaqueteHabilitado[]>{
        return this.requester.get<PaqueteHabilitado[]>(this.REQUEST_URL, {});
    }    

}   