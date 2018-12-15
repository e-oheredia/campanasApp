import { BuzonService } from './buzon.service';
import { Observable } from 'rxjs';
import { Campana } from '../model/campana.model';
import { AppSettings } from '../settings/app.settings';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { HttpParams } from '@angular/common/http';
import { WriteExcelService } from './write-excel.service';
import * as moment from 'moment-timezone';


@Injectable()
export class CampanaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.CAMPANA_URL;

    constructor(
        private requester: RequesterService,
        private writeExcelService: WriteExcelService,
        private buzonService: BuzonService
    ) {

    }

    getFechaCreacion(campana: Campana): Date | string {
        return campana.seguimientosCampana.find(seguimientoCampana =>
            seguimientoCampana.estadoCampana.id === 1
        ).fecha;
    }

    listarCampanasPorEstado(estadoCampana: number): Observable<Campana[]>{
        return this.requester.get<Campana[]>(this.REQUEST_URL, {
            params: new HttpParams().append('estadoId', estadoCampana.toString())
        });
    }

    listarCampanasPorEstados(estadosCampana: number[]): Observable<Campana[]> {
        return this.requester.get<Campana[]>(this.REQUEST_URL, {
            params: new HttpParams().append('estadoIds', estadosCampana.toString())
        });
    }

    seleccionarProveedor(campana: Campana): Observable<Campana[]> {
        return this.requester.put<Campana[]>(this.REQUEST_URL + campana.id + "/seleccionproveedor", campana, {});
    }

    registrarCampana(campana: Campana): Observable<Campana[]> {
        campana.buzon = this.buzonService.getBuzonActual();
        return this.requester.post<Campana[]>(this.REQUEST_URL, campana, {});
    }

    recotizarCampana(campana: Campana): Observable<Campana[]> {
        return this.requester.put<Campana[]>(this.REQUEST_URL + campana.id + "/recotizacion", campana, {});
    }

    getUltimoSeguimientoCampana(campana: Campana){

        return campana.seguimientosCampana.reduce(
            (max, seguimientoCampana) =>
                moment(seguimientoCampana.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimientoCampana : max, campana.seguimientosCampana[0]
        )
    }

    exportarItemsCampanaPorGeoReferenciar(campana: Campana) {
        let objects = [];
        campana.itemsCampana.forEach(ItemCampana => {
            objects.push({
                "Numero de Campaña": this.codigoAutogenerado(campana.id,"DOC"),
                "Codigo de Item": ItemCampana.id,
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Distrito": ItemCampana.distrito.nombre,
                "Dirección": ItemCampana.direccion,
                "Estado": ""
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Campaña: " + campana.id);
    }

    georeferenciarBase(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + "subirbasegeo", campana, {});
    }

    codigoAutogenerado(id: number, prefijo: String) {

        let autogenerado: String;
        let longitud: number = 7;
        var length = id.toString().length;
        var cero = "0";
        autogenerado = prefijo + cero.repeat(longitud - length) + id.toString();
        return autogenerado;        
    }

    extraerIdAutogenerado(autogenerado: String){
        return parseInt(autogenerado.substring(3,10));
    }
    confirmarBaseGeo(campana: Campana): Observable<Campana>{
        return this.requester.put<Campana>(this.REQUEST_URL + campana.id + "/confirmarbasegeo", campana, {});
    }

    listarCampanaParaRecotizar() {
        return this.requester.get<Campana[]>(this.REQUEST_URL + "/pararecotizacion", {});

    }

}   