import { AppSettings } from './../settings/app.settings';
import { Provincia } from './../model/provincia.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { UtilsService } from "./utils.service";

@Injectable()
export class ProvinciaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVINCIA_URL;
    DEPARTAMENTO_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.DEPARTAMENTO_URL;

    constructor(private requester: RequesterService, private utilsService: UtilsService){
        this.listarAll().subscribe(
            provincias => {
                this.provincias = provincias;
                this.provinciasChanged.next(this.provincias);
            }
        )
    }

    private provincias: Provincia[];
    public provinciasChanged = new Subject<Provincia[]>();

    listarProvinciaByDepartamentoId(departamentoId: number): Observable<Provincia[]>{
        return this.requester.get<Provincia[]>(this.DEPARTAMENTO_REQUEST_URL + departamentoId.toString() + "/" 
        + AppSettings.PROVINCIA_URL, {});
    }

    listarAll(): Observable<Provincia[]>{
        return this.requester.get<Provincia[]>(this.REQUEST_URL, {});
    }

    listarProvinciaByNombreProvinciaAndNombreDepartamento(nombreProvincia: string, nombreDepartamento: string): Provincia {
        if (this.utilsService.isUndefinedOrNullOrEmpty(nombreProvincia)) {
            return null;
        }
        let provinciasFiltradas = this.provincias.filter(provincia => provincia.nombre.toUpperCase().trim() === nombreProvincia.toUpperCase().trim());
        if (provinciasFiltradas.length === 0) {
            return null;
        }
        return provinciasFiltradas[0].departamento.nombre.toUpperCase().trim() === nombreDepartamento.toUpperCase().trim() ? provinciasFiltradas[0] : null;
    }

}