import { Observable } from 'rxjs';
import { AppSettings } from '../settings/app.settings';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { TipoDocumento } from '../model/tipodocumento.model';



@Injectable()//1
export class TipoDocumentoService {
    //2
    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_DOCUMENTO_URL;


    constructor(private requester: RequesterService) { }

    //3
    public listarAll():Observable<TipoDocumento[]>{
       return this.requester.get<TipoDocumento[]>(this.REQUEST_URL,{})
    }


    
}   