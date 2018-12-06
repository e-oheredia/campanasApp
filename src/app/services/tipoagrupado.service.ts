import { TipoAgrupado } from '../model/tipoagrupado.model';

import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';


@Injectable()
export class TipoAgrupadoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_AGRUPADO_URL;

    constructor(
        private requester: RequesterService) {}

        
    listarAll(): Observable<TipoAgrupado[]>{
        return this.requester.get<TipoAgrupado[]>(this.REQUEST_URL, {});
    }    

}   