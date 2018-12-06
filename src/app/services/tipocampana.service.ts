import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { TipoCampana } from '../model/tipocampana.model';


@Injectable()
export class TipoCampanaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_CAMPANA_URL;

    constructor(
        private requester: RequesterService
    ) {

    }

    listarAll(): Observable<TipoCampana[]>{
        return this.requester.get<TipoCampana[]>(this.REQUEST_URL, {});
    }    

}   