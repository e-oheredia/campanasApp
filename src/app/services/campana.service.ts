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
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { ItemCampana } from '../model/itemcampana.model';
import { TipoEntrega } from '../model/tipoentrega.model';
import { TipoHabilitado } from '../model/tipohabilitado.model';
import { EstadoItemCampana } from '../model/estadoItemCampana.model';
import { EstadoItemCampanaEnum } from '../enum/estadoitemcampana.enum';
import { RegionService } from './region.service';
import { Region } from '../model/region.model';

@Injectable()
export class CampanaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.CAMPANA_URL;

    constructor(
        private requester: RequesterService,
        private writeExcelService: WriteExcelService,
        private buzonService: BuzonService,
        private regionService: RegionService,
        private utils: UtilsService
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

    getFechaMuestraSolicitada(campana: Campana) {
        return campana.seguimientosCampana.find(seguimientoCampana =>
            seguimientoCampana.estadoCampana.id === EstadoCampanaEnum.MUESTRA_SOLICITADA
        ).fecha;
    }

    getFechaPorEstado(campana: Campana, estadoId: Number) {
        let c = campana.seguimientosCampana.filter(x => x.estadoCampana).sort((a, b) =>
            a.estadoCampana.id - b.estadoCampana.id).find(oka => oka.estadoCampana.id === estadoId)
        if (this.utils.isUndefinedOrNullOrEmpty(c)) {
            return null;
        }
        else {
            return c.fecha;
        }
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
        campana.itemsCampana.sort((a, b) => a.correlativoBase - b.correlativoBase).forEach(ItemCampana => {
            if (ItemCampana.enviable === false) {
                objects.push({
                    "Código de Item": ItemCampana.id,
                    "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                    "Correlativo": ItemCampana.correlativoBase,
                    "Razon Social": ItemCampana.razonSocial,
                    "Apellido Paterno": ItemCampana.apellidoPaterno,
                    "Apellido Materno": ItemCampana.apellidoMaterno,
                    "Nombres": ItemCampana.nombres,
                    "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                    "Provincia": ItemCampana.distrito.provincia.nombre,
                    "Distrito": ItemCampana.distrito.nombre,
                    "Dirección": ItemCampana.direccion,
                    "IDC": ItemCampana.idc,
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
                "Código de Item": ItemCampana.id,
                "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Distrito": ItemCampana.distrito.nombre,
                "Dirección": ItemCampana.direccion,
                "IDC": ItemCampana.idc,
                "Estado": ItemCampana.enviable ? "NORMALIZADO" : "NO DISTRIBUIBLE"
            })
        });
        if (objects.length > 0) {
            this.writeExcelService.jsonToExcel(objects, "Campaña: " + campana.id);
        }
    }

    exportarItemsCampanaPendientesPorAdjuntarConfirmacion(campana: Campana) {
        let objects = [];
        campana.itemsCampana.sort((a, b) => a.correlativoBase - b.correlativoBase).forEach(ItemCampana => {
            objects.push({
                "Código de Item": ItemCampana.id,
                "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                "Correlativo": ItemCampana.correlativoBase,
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Distrito": ItemCampana.distrito.nombre,
                "Dirección": ItemCampana.direccion,
                "IDC": ItemCampana.idc,
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
                "Código de Item": ItemCampana.id,
                "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                "Correlativo de Distribución": ItemCampana.correlativo,
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Dirección": ItemCampana.direccion,
                "Distrito": ItemCampana.distrito.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Ámbito": ItemCampana.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" ? "LIMA" : "PROVINCIA",
                "IDC": ItemCampana.idc,
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

    subirReporte(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + "cargarreportefinal", campana, {});
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

    adjuntarGuiaRecojo(campana: Campana, file: File): Observable<Campana> {
        let form: FormData = new FormData;
        if (file !== null && file != undefined) {
            form.append("file", file);
        }
        return this.requester.post<Campana>(this.REQUEST_URL + campana.id + "/adjuntarguia", form, {});
    }

    aceptarGuia(campana: Campana): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + "aprobarguia", campana, {});
    }

    denegarGuia(campanaId: number): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campanaId.toString() + "/denegarguia", null, {});
    }

    iniciarDistribucion(campanaId: number): Observable<Campana> {
        return this.requester.put<Campana>(this.REQUEST_URL + campanaId.toString() + "/iniciardistribucion", null, {});
    }

    exportarItemsCampanaDistribucion(campana: Campana) {
        let objects = [];
        campana.itemsCampana.filter(x => x.correlativo > 0).sort((a, b) => a.correlativo - b.correlativo).forEach(ItemCampana => {
            objects.push({
                "Código de Item": ItemCampana.id,
                "Código de Campaña": this.codigoAutogenerado(campana.id, "DOC"),
                "Correlativo de Distribución": ItemCampana.correlativo,
                "Razon Social": ItemCampana.razonSocial,
                "Apellido Paterno": ItemCampana.apellidoPaterno,
                "Apellido Materno": ItemCampana.apellidoMaterno,
                "Nombres": ItemCampana.nombres,
                "Dirección": ItemCampana.direccion,
                "Distrito": ItemCampana.distrito.nombre,
                "Provincia": ItemCampana.distrito.provincia.nombre,
                "Departamento": ItemCampana.distrito.provincia.departamento.nombre,
                "Ámbito": ItemCampana.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" ? "LIMA" : "PROVINCIA",
                "IDC": ItemCampana.idc,
                "Estado": "",
                "Detalle": "",
            })
        });
        if (objects.length > 0) {
            this.writeExcelService.jsonToExcel(objects, "Campaña: " + campana.id);
        }
    }

    exportarReporte(campanas: Campana[], region: Region[]) {
        let objects = [];
        campanas.forEach(campana => {


            let proveedorNombre = "";
            let tipoCampanaNombre = "";
            if (!this.utils.isUndefinedOrNullOrEmpty(campana.proveedor)) proveedorNombre = campana.proveedor.nombre;
            if (!this.utils.isUndefinedOrNullOrEmpty(campana.tipoCampana)) tipoCampanaNombre = campana.tipoCampana.nombre;


            let fechaFinLima = this.regionService.fechaFinalLima(campana, region);
            let fechaFinProvincia = this.regionService.fechaFinalProvincia(campana, region);
            let ultimaFechaProgramadaReporte = this.regionService.ultimaFechaProgramadaReporte(campana, region);


            let fechaAsignacionProveedor = this.getFechaPorEstado(campana, 2);
            let fechaGeoreferenciacion = this.getFechaPorEstado(campana, 3);
            let fechaConfirmacionGeo = this.getFechaPorEstado(campana, 5);
            let fechaRecotizacion = this.getFechaPorEstado(campana, 6);
            let fechaConfirmacionCotizacion = this.getFechaPorEstado(campana, 8);
            let fechaSolicitudMuestra = this.getFechaPorEstado(campana, 10);
            let fechaEnvioMuestra = this.getFechaPorEstado(campana, 11);
            let fechaConfirmacionSolicitudImpresion = this.getFechaPorEstado(campana, 12);
            let fechaInicioImpresion = this.getFechaPorEstado(campana, 14);
            let fechaProgramacionRecojo = this.getFechaPorEstado(campana, 15);
            let fechaGuiaAdjunta = this.getFechaPorEstado(campana, 16);
            let fechaEnvioOperativa = this.getFechaPorEstado(campana, 17);
            let fechaInicioDistribucionReal = this.getFechaPorEstado(campana, 19);
            let fechaRealReporte = this.getFechaPorEstado(campana, 20);
            if (this.utils.isUndefinedOrNullOrEmpty(fechaAsignacionProveedor)) fechaAsignacionProveedor = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaGeoreferenciacion)) fechaGeoreferenciacion = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaConfirmacionGeo)) fechaConfirmacionGeo = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaRecotizacion)) fechaRecotizacion = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaConfirmacionCotizacion)) fechaConfirmacionCotizacion = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaSolicitudMuestra)) fechaSolicitudMuestra = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaEnvioMuestra)) fechaEnvioMuestra = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaConfirmacionSolicitudImpresion)) fechaConfirmacionSolicitudImpresion = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaInicioImpresion)) fechaInicioImpresion = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaProgramacionRecojo)) fechaProgramacionRecojo = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaGuiaAdjunta)) fechaGuiaAdjunta = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaEnvioOperativa)) fechaEnvioOperativa = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaInicioDistribucionReal)) fechaInicioDistribucionReal = "-";
            if (this.utils.isUndefinedOrNullOrEmpty(fechaRealReporte)) fechaRealReporte = "-";


            let cantidadDocumentosTotales = this.contarDocumentosGeo(campana.itemsCampana, true, true) + this.contarDocumentosGeo(campana.itemsCampana, false, true)
            if (cantidadDocumentosTotales === 0) {
                cantidadDocumentosTotales = campana.itemsCampana.length
            }


            let fechaInicioDistribucionProgramado;
            if (this.utils.isUndefinedOrNullOrEmpty(campana.fechaDistribucion)) {
                fechaInicioDistribucionProgramado = "-";
            }
            else {
                fechaInicioDistribucionProgramado = campana.fechaDistribucion;
            }

            
            let cantidadEntregados = 0;
            let cantidadRezagados = 0;
            let cantidadFaltantes = 0;
            let cantidadNoDistribuibles = 0;
            if (this.getUltimoSeguimientoCampana(campana).estadoCampana.id >= EstadoCampanaEnum.REPORTE_ADJUNTADO) cantidadEntregados = this.contarDocumentosPorEstado(campana.itemsCampana, EstadoItemCampanaEnum.ENTREGADO);
            if (this.getUltimoSeguimientoCampana(campana).estadoCampana.id >= EstadoCampanaEnum.REPORTE_ADJUNTADO) cantidadRezagados = this.contarDocumentosPorEstado(campana.itemsCampana, EstadoItemCampanaEnum.REZAGADO);
            if (this.getUltimoSeguimientoCampana(campana).estadoCampana.id >= EstadoCampanaEnum.REPORTE_ADJUNTADO) cantidadFaltantes = this.contarDocumentosPorEstado(campana.itemsCampana, EstadoItemCampanaEnum.FALTANTE);
            if (this.getUltimoSeguimientoCampana(campana).estadoCampana.id >= EstadoCampanaEnum.REPORTE_ADJUNTADO) cantidadNoDistribuibles = this.contarDocumentosPorEstado(campana.itemsCampana, EstadoItemCampanaEnum.NO_DISTRIBUIBLE);


            objects.push({
                "Código de campaña": campana.id,
                "Nombre de campaña": campana.nombre,
                "Usuario solicitante": campana.buzon.nombre,
                "Área solicitante": campana.buzon.area.nombre,
                "Proveedor": proveedorNombre,
                "Tipo de campaña": tipoCampanaNombre,
                "Tipo de destino": campana.tipoDestino.nombre,
                "Tipo de documento": campana.tipoDocumento.nombre,
                "Tipo de producto": campana.tipoDocumento.nombre,
                "Tipo de entrega": this.verTipoEntrega(campana.tiposEntrega),
                "Tipo de habilitado": this.verTipoHabilitado(campana.paqueteHabilitado.tiposHabilitado),
                "Plazo de distribución": campana.plazo.nombre,
                "¿Requiere geo?": campana.requiereGeorreferencia ? "SI" : "NO",
                "Cantidad de geo": campana.seguimientosCampana.filter(seguimientocampana => seguimientocampana.estadoCampana.id === EstadoCampanaEnum.GEOREFERENCIADA).length,
                "¿Requiere impresión?": campana.proveedorImpresion ? "SI" : "NO",
                "¿Devolución de rezagos?": campana.accionRestosRezagosCampana ? "SI" : "NO",
                "¿Devolución de cargos?": campana.accionRestosCargosCampana ? "SI" : "NO",
                "¿Requiere gps?": campana.requiereGps ? "SI" : "NO",
                "Cantidad Lima inicial": campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
                "Cantidad Provincia inicial": campana.itemsCampana.length - campana.itemsCampana.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length,
                "Cantidad Lima final": this.contarDocumentosGeo(campana.itemsCampana, true, true),
                "Cantidad Provincia final": this.contarDocumentosGeo(campana.itemsCampana, false, true),
                "Cantidad total": cantidadDocumentosTotales,
                "Estado actual de la campaña": this.getUltimoSeguimientoCampana(campana).estadoCampana.nombre,
                "Fecha de creación": this.getFechaCreacion(campana),
                "Fecha de asignación de proveedor": fechaAsignacionProveedor,
                "Fecha de geo": fechaGeoreferenciacion,
                "Fecha de confirmación de geo": fechaConfirmacionGeo,
                "Fecha de recotización": fechaRecotizacion,
                "Fecha de confirmación de cotización": fechaConfirmacionCotizacion,
                "Fecha de solicitud de muestra": fechaSolicitudMuestra,
                "Fecha de envío de muestra": fechaEnvioMuestra,
                "Fecha de confirmación y solicitud de impresion": fechaConfirmacionSolicitudImpresion,
                "Fecha de inicio de impresión": fechaInicioImpresion,
                "Fecha de programación de recojo": fechaProgramacionRecojo,
                "Fecha de recojo real": "-", //falta agregar atributo a la campaña
                "Fecha de guía adjuntada": fechaGuiaAdjunta,
                "Fecha de envío de operativa": fechaEnvioOperativa,
                "Fecha de inicio de habilitado": "-", //falta agregar campo a la vista 'guia aceptada'
                "Fecha de inicio de distribución programada": fechaInicioDistribucionProgramado,
                "Fecha de inicio de distribución real": fechaInicioDistribucionReal, //falta definir columnas del reporte del proveedor
                "Fecha fin de distribución Lima - programada": fechaFinLima,
                "Fecha fin de distribución Provincia - programada": fechaFinProvincia,
                "Fecha fin de distribución Lima - real": "-", //falta definir columnas del reporte del proveedor
                "Fecha fin de distribución Provincia - real": "-", //falta definir columnas del reporte del proveedor
                "Fecha programada del reporte": ultimaFechaProgramadaReporte,
                "Fecha real del reporte": fechaRealReporte,
                "Cantidad de Entregados": cantidadEntregados,
                "Cantidad de Rezagados": cantidadRezagados,
                "Cantidad de Faltantes": cantidadFaltantes,
                "Cantidad de no distribuibles": cantidadNoDistribuibles
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Reporte-de-Campañas");
    }


    verTipoEntrega(tipoEntrega: TipoEntrega[]) {
        let entrega = "";
        let i = 1;
        tipoEntrega.forEach(e => {
            entrega += " " + e.nombre;
            if (tipoEntrega.length > i) {
                entrega += ",";
            }
            i++;
        })
        return entrega;
    }

    verTipoHabilitado(tipoHabilitado: TipoHabilitado[]) {
        let habilitado = "";
        let i = 1;
        tipoHabilitado.forEach(t => {
            habilitado += " " + t.descripcion;
            if (tipoHabilitado.length > i) {
                habilitado += ",";
            }
            i++;
        })
        return habilitado;
    }


    contarDocumentosGeo(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
        return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;
    }


    contarDocumentosPorEstado(documentos: ItemCampana[], estadoItemCampana): number {
        let d = documentos.filter(documento => (documento.enviable === true) && (documento.estadoItemCampana.id === estadoItemCampana.id));
        if (this.utils.isUndefinedOrNullOrEmpty(d)){
            return 0;
        }
        else {
            return d.length;
        }

    }


    generarReporteUTD(fechaini: Date, fechafin: Date, idestado: number): Observable<Campana[]> {
        return this.requester.get<Campana[]>(this.REQUEST_URL + "reporte", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()).append('estadoCampanaId', idestado.toString()) });
    }
}   