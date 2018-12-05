import { Observable } from 'rxjs';
import { AppSettings } from '../settings/app.settings';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { Buzon } from "../model/buzon.model";
import { Subject } from 'rxjs';



@Injectable()
export class BuzonService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.MENU_URL;

    constructor(private requester: RequesterService) { }

    public buzonActualChanged = new Subject<Buzon>();

    private buzonesEmpleadoAutenticado: Buzon[];

    public getBuzonesEmpleadoAutenticado(): Buzon[]{
        return this.buzonesEmpleadoAutenticado;
    }

    public setBuzonesEmpleadoAutenticado(buzones: Buzon[]){
        this.buzonesEmpleadoAutenticado = buzones;        
    }

    private buzonActual: Buzon;

    public getBuzonActual(): Buzon {
        return this.buzonActual;
    }

    public setBuzonActual(buzon: Buzon){
        this.buzonActual = buzon;
        this.buzonActualChanged.next(this.buzonActual);
    }

    public listarBuzonesAll(): Observable<Buzon[]>{
        return this.requester.get<Buzon[]>(this.REQUEST_URL,{});
    }
    
}   