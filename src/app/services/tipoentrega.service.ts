import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { TipoEntrega } from '../model/tipoentrega.model';


@Injectable()
export class TipoEntregaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_ENTREGA_URL;

    constructor(
        private requester: RequesterService) {}

        
    listarAll(): Observable<TipoEntrega[]>{
        return this.requester.get<TipoEntrega[]>(this.REQUEST_URL, {});
    }    

}   