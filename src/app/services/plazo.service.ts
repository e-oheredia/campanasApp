import { Observable } from 'rxjs';
import { AppSettings } from '../settings/app.settings';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { Buzon } from "../model/buzon.model";
import { Subject } from 'rxjs';
import { Plazo } from '../model/plazo.model';



@Injectable()//1
export class PlazoService {
    //2
    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PLAZO_URL;


    constructor(private requester: RequesterService) { }

    //3
    public listarAll():Observable<Plazo[]>{
       return this.requester.get<Plazo[]>(this.REQUEST_URL,{})
    }


    
}   