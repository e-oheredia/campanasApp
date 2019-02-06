import { Region } from '../model/region.model';
import { Campana } from '../model/campana.model';
import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import * as moment from 'moment-timezone';
import { UtilsService } from './utils.service';


@Injectable()
export class RegionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REGION_URL;

    constructor(
        private requester: RequesterService,
        private utils: UtilsService
    ) {

    }

    listarAll(): Observable<Region[]>{
        return this.requester.get<Region[]>(this.REQUEST_URL, {});
    }    
    

    fechaFinalLima(campana: Campana, region: Region[]): string {

        let fechaLima = "-";
        let r = region.find(x => x.nombre.trim().toUpperCase() === 'LIMA');

        if (r === undefined || r === null){
            return fechaLima;
        }
        
        if (this.utils.isUndefinedOrNullOrEmpty(campana.fechaDistribucion)){
            return fechaLima;
        }
        let fecha = campana.fechaDistribucion.toString().substring(0,10);
        let dateParts = fecha.split("-");
        
        let fechaDistribucion = new Date(moment(new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, parseInt(dateParts[0])), "DD-MM-YYYY HH:mm:ss"));
        let itemCampanaList = campana.itemsCampana.filter(x => x.distrito.provincia.nombre.trim() === 'Lima');
        
        if (itemCampanaList.length > 0){
            
            fechaLima = moment(new Date(fechaDistribucion.setDate(fechaDistribucion.getDate() + r.plazo -1))).format("DD-MM-YYYY");
        }
        return fechaLima;
    }

    fechaFinalProvincia(campana: Campana, region: Region[]): string {

        let fechaProvincia = "-";
        let r = region.find(x => x.nombre.trim().toUpperCase() === 'PROVINCIA');

        if (r === undefined || r === null){
            return fechaProvincia;
        }

        if (this.utils.isUndefinedOrNullOrEmpty(campana.fechaDistribucion)){
            return fechaProvincia;
        }

        let fecha = campana.fechaDistribucion.toString().substring(0,10);
        let dateParts = fecha.split("-");
        
        let fechaDistribucion = new Date(moment(new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, parseInt(dateParts[0])), "DD-MM-YYYY HH:mm:ss"));
        let itemCampanaList = campana.itemsCampana.filter(x => x.distrito.provincia.nombre.trim() === 'Lima');

        
        if (itemCampanaList.length > 0){
            
            fechaProvincia = moment(new Date(fechaDistribucion.setDate(fechaDistribucion.getDate() + r.plazo -1))).format("DD-MM-YYYY");
        }
        return fechaProvincia;
    }

    ultimaFechaDistribucion(campana: Campana, region: Region[]): string {

        if(this.fechaFinalProvincia(campana, region) === "-"){
            return this.fechaFinalLima(campana, region);
        }else{
            return this.fechaFinalProvincia(campana, region);
        }

    }

    ultimaFechaProgramadaReporte(campana: Campana, region: Region[]): string {
        let fechaReporte = "-";

        if(this.ultimaFechaDistribucion(campana,region) === "-"){
            return fechaReporte;
        }        
       

        let fecha = this.ultimaFechaDistribucion(campana,region).toString().substring(0,10);
        let dateParts = fecha.split("-");
        let fechaDistribucion =  new Date(moment(new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, parseInt(dateParts[0])), "DD-MM-YYYY HH:mm:ss"));

        return fechaReporte = moment(new Date(fechaDistribucion.setDate(fechaDistribucion.getDate()+10))).format("DD-MM-YYYY");
    }

}   