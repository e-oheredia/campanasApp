import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EstadoItemCampana } from '../model/estadoItemCampana.model';
import { RequesterService } from './requester.service';
import { AppSettings } from '../settings/app.settings';
import { UtilsService } from './utils.service';


@Injectable()
export class EstadoItemCampanaService {

    ESTADOITEMCAMPANA_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ESTADOITEMCAMPANA_URL;

    constructor(private requester: RequesterService){
        this.listarEstadosReporte().subscribe(
            estadoReporte => {
                this.estadoReporte = estadoReporte;
            }
        )
    }

    private estadoReporte: EstadoItemCampana[];
    public estadoReporteChanged = new Subject<EstadoItemCampana[]>();

    public getEstadosItemCampana(): EstadoItemCampana[]{
        return this.estadoReporte;
    }

    listarEstadosReporte(): Observable<EstadoItemCampana[]>{
        return this.requester.get<EstadoItemCampana[]>(this.ESTADOITEMCAMPANA_REQUEST_URL, {});
    }

}   