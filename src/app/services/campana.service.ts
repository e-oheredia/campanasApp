import { Observable } from 'rxjs';
import { Campana } from '../model/campana.model';
import { AppSettings } from '../settings/app.settings';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class CampanaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.CAMPANA_URL;

    constructor(
        private requester: RequesterService
    ) {

    }

    listarCampanasPorEstado(estadoCampana: number): Observable<Campana[]>{
        return this.requester.get<Campana[]>(this.REQUEST_URL, {
            params: new HttpParams().append('estadoId', estadoCampana.toString())
        });
    }    

    seleccionarProveedor(campana: Campana): Observable<Campana[]> {
        return this.requester.put<Campana[]>(this.REQUEST_URL + campana.id + "/seleccionproveedor", campana, {});
    }

}   