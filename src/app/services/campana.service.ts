import { BuzonService } from './buzon.service';
import { Observable } from 'rxjs';
import { Campana } from '../model/campana.model';
import { AppSettings } from '../settings/app.settings';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { HttpParams } from '@angular/common/http';
import { WriteExcelService } from './write-excel.service';
import * as moment from 'moment-timezone';
import { UtilsService } from './utils.service';
import { ItemCampana } from '../model/itemcampana.model';
import { SeguimientoCampana } from '../model/seguimientocampana.model';
import { Form } from '@angular/forms';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';

@Injectable()
export class CampanaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.CAMPANA_URL;

    constructor(
        private requester: RequesterService,
        private writeExcelService: WriteExcelService,
        private utilsService: UtilsService,
        private buzonService: BuzonService
    ) {

    }

    getFechaCreacion(campana: Campana): Date | string {
        return campana.seguimientosCampana.find(seguimientoCampana =>
            seguimientoCampana.estadoCampana.id === 1
        ).fecha;
    }
    
    getFechaMuestraAceptada(campana: Campana): Date | string {
        return campana.seguimientosCampana.find(seguimientoCampana =>
            seguimientoCampana.estadoCampana.id === 12
        ).fecha;
    }

    getFechaMuestraSolicitada(campana: Campana){
        return campana.seguimientosCampana.find(seguimientoCampana =>
            seguimientoCampana.estadoCampana.id === EstadoCampanaEnum.MUESTRA_SOLICITADA
        ).fecha;
    }
 
    listarCampanasPorEstado(estadoCampana: number): Observable<Campana[]> {
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

    registrarCampana(campana: Campana): Observable<Campana> {
        campana.buzon = this.buzonService.getBuzonActual();
        return this.requester.post<Campana>(this.REQUEST_URL, campana, {});
    }

    recotizarCampana(campana: Campana): Observable<Campana[]> {
        return this.requester.put<Campana[]>(this.REQUEST_URL + campana.id + "/recotizacion", campana, {});
    }

    getUltimoSeguimientoCampana(campana: Campana) {

        return campana.seguimientosCampana.reduce(
            (max, seguimientoCampana) =>
                moment(seguimientoCampana.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimientoCampana : max, campana.seguimientosCampana[0]
        )
    }

    exportarItemsCampanaPorGeoReferenciar(campana: Campana) {
        let objects = [];
        campana.itemsCampana.forEach(ItemCampana => {
            if (ItemCampana.enviable === false) {
                objects.push({
                    "Numero de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
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
            }
        });
        if (objects.length > 0) {
            this.writeExcelService.jsonToExcel(objects, "Campaña: " + campana.id);
        }
    }

    exportarItemsCampanaConfirmacionCotizacion(campana: Campana) {
        let objects = [];
        campana.itemsCampana.sort((a, b) => a.correlativo - b.correlativo).forEach(ItemCampana => {
            objects.push({
                "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                "Código de Item": ItemCampana.id,
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Distrito": ItemCampana.distrito.nombre,
                "Dirección": ItemCampana.direccion,
                "Estado": ItemCampana.enviable ? "NORMALIZADO" : "NO DISTRIBUIBLE"
            })
        });
        if (objects.length > 0) {
            this.writeExcelService.jsonToExcel(objects, "Campaña: " + campana.id);
        }
    }

    exportarItemsCampanaPendientesPorAdjuntarConfirmacion(campana: Campana) {
        let objects = [];
        campana.itemsCampana.sort((a, b) => a.correlativo - b.correlativo).forEach(ItemCampana => {
            objects.push({
                "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                "Código de Item": ItemCampana.id,
                "Correlativo": ItemCampana.correlativo,
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Distrito": ItemCampana.distrito.nombre,
                "Dirección": ItemCampana.direccion,
                "Estado": ItemCampana.enviable ? "NORMALIZADO" : "NO DISTRIBUIBLE"
            })
        });
        if (objects.length > 0) {
            this.writeExcelService.jsonToExcel(objects, "Campaña: " + campana.id);
        }
    }

    exportarItemsCampanaPendienteConfirmaciónAdjunta(campana: Campana) {
        let objects = [];
        campana.itemsCampana.filter(x => x.correlativo > 0).sort((a, b) => a.correlativo - b.correlativo).forEach(ItemCampana => {
            objects.push({
                "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                "Código de Item": ItemCampana.id,
                "Correlativo": ItemCampana.correlativo,
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Ámbito": ItemCampana.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" ? "LIMA" : "PROVINCIA",
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Distrito": ItemCampana.distrito.nombre,
                "Dirección": ItemCampana.direccion,
                "Estado": ItemCampana.enviable ? "NORMALIZADO" : "NO DISTRIBUIBLE"
            })
        });
        if (objects.length > 0) {
            this.writeExcelService.jsonToExcel(objects, "Campaña: " + campana.id);
        }
    }

    georeferenciarBase(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + "subirbaseproveedor", campana, {});
    }

    codigoAutogenerado(id: number, prefijo: String) {

        let autogenerado: String;
        let longitud: number = 7;
        var length = id.toString().length;
        var cero = "0";
        autogenerado = prefijo + cero.repeat(longitud - length) + id.toString();
        return autogenerado;
    }

    extraerIdAutogenerado(autogenerado: String) {
        return parseInt(autogenerado.substring(3, 10));
    }
    confirmarBaseGeo(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campana.id + "/confirmarbasegeo", campana, {});
    }

    listarCampanaParaRecotizar() {
        return this.requester.get<Campana[]>(this.REQUEST_URL + "/pararecotizacion", {});

    }

    modificarBase(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + "modificarbasegeo", campana, {});
    }

    adjuntarConformidad(campana: Campana, file: File): Observable<Campana> {
        let form: FormData = new FormData;
        if (file !== null && file != undefined) {
            form.append("file", file);
        }
        return this.requester.post<Campana>(this.REQUEST_URL + campana.id + "/adjuntarconformidad", form, {});
    }

    solicitarMuestra(campanaId: number): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campanaId.toString() + "/solicitarmuestra", null, {});
    }

    aceptarConformidad(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campana.id + "/aceptarconformidad", campana, {});
    }

    denegarConformidad(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campana.id + "/denegarconformidad", campana, {});
    }

    iniciarImpresión(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campana.id + "/iniciarimpresion", campana, {});
    }

    enviarDatosRecojo(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + "datosimpresion", campana, {});
    }

    adjuntarMuestra(campana: Campana, file: File): Observable<Campana> {
        let form: FormData = new FormData;
        if (file !== null && file != undefined) {
            form.append("file", file);
        }
        return this.requester.post<Campana>(this.REQUEST_URL + campana.id + "/adjuntarmuestra", form, {});
    }

    aprobarMuestra(campanaId: number): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campanaId.toString() + "/aprobarmuestra", null, {});
    }

    denegarMuestra(campanaId: number): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campanaId.toString() + "/denegarmuestra", null, {});
    }

}   