import { Buzon } from '../model/buzon.model';
import { AppSettings } from '../settings/app.settings';
import { Empleado } from '../model/empleado.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable } from "rxjs";
import { BuzonService } from "./buzon.service";


@Injectable()
export class EmpleadoService {

    constructor(private requester: RequesterService, private buzonService: BuzonService) { }

    private empleadoAutenticado: Empleado;

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.EMPLEADO_URL;

    public getEmpleadoAutenticado() {
        return this.empleadoAutenticado;
    }

    listarEmpleadoAutenticado() {
        this.requester.get<Empleado>(this.REQUEST_URL + "autenticado", {})
            .subscribe(
                empleado => {
                    this.empleadoAutenticado = empleado;
                    let buzones: Buzon[] = [];
                    if (empleado.buzones) {
                        empleado.buzones.forEach(buzonEmpleado => {
                            buzones.push(buzonEmpleado.buzon);
                        });
                        this.buzonService.setBuzonesEmpleadoAutenticado(buzones);
                        this.buzonService.setBuzonActual(buzones[0]);
                    }
                },
                error => {
                    console.log(error);
                }
            );
    }

    listarEmpleadosAll(): Observable<Empleado[]> {
        return this.requester.get(this.REQUEST_URL, {});
    }
}