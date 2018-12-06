import { Plazo } from './../model/plazo.model';
import { Buzon } from './../model/buzon.model';
import { AppSettings } from './../settings/app.settings';
import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Subject } from "rxjs";


@Injectable()
export class BuzonService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.BUZON_URL;

    constructor(private requester: RequesterService){}

    public buzonActualChanged = new Subject<Buzon>();

    private buzonesEmpleadoAutenticado: Buzon[];

    public getBuzonesEmpleadoAutenticado(): Buzon[]{
        return this.buzonesEmpleadoAutenticado;
    }

    public setBuzonesEmpleadoAutenticado(buzones: Buzon[]){
        this.buzonesEmpleadoAutenticado = buzones;        
    }

    private buzonActual: Buzon;
    
    public getBuzonActual(): Buzon{
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
