import { Observable } from 'rxjs';
import { AppSettings } from '../settings/app.settings';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { TipoDestino } from '../model/tipodestino.model';



@Injectable()//1
export class TipoDestinoService {
    //2
    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_DESTINO_URL;


    constructor(private requester: RequesterService) { }

    //3
    public listarAll():Observable<TipoDestino[]>{
       return this.requester.get<TipoDestino[]>(this.REQUEST_URL,{})
    }


    
}   