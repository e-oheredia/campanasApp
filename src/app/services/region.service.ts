import { Region } from '../model/region.model';
import { Campana } from '../model/campana.model';

import { AppSettings } from '../settings/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { CampanaService } from './campana.service';
import { ItemCampanaService } from './itemcampana.service';
import { UtilsService } from './utils.service';
import * as moment from 'moment-timezone';


@Injectable()
export class RegionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REGION_URL;

    constructor(
        private requester: RequesterService
    ) {

    }

    listarAll(): Observable<Region[]>{
        return this.requester.get<Region[]>(this.REQUEST_URL, {});
    }    
    

    fechaFinalLima(campana: Campana, region: Region[]): string {

        let fechaLima = "-";
        let r = region.find(x => x.nombre.trim() === 'Lima');

        if (r === undefined || r === null){
            return fechaLima;
        }
        
        let fecha = campana.fechaDistribucion.toString().substring(0,10);
        let dateParts = fecha.split("-");
        
        let fechaDistribucion = new Date(moment(new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, parseInt(dateParts[0])), "DD-MM-YYYY HH:mm:ss"));
        let itemCampanaList = campana.itemsCampana.filter(x => x.distrito.provincia.nombre.trim() === 'Lima');
        
        if (itemCampanaList.length > 0){
            
            fechaLima = moment(new Date(fechaDistribucion.setDate(fechaDistribucion.getDate() + r.plazo))).format("DD-MM-YYYY");
        }
        return fechaLima;
    }

    fechaFinalProvincia(campana: Campana, region: Region[]): string {

        let fechaProvincia = "-";
        let r = region.find(x => x.nombre.trim() === 'Provincia');

        if (r === undefined || r === null){
            return fechaProvincia;
        }

        let fecha = campana.fechaDistribucion.toString().substring(0,10);
        let dateParts = fecha.split("-");
        
        let fechaDistribucion = new Date(moment(new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, parseInt(dateParts[0])), "DD-MM-YYYY HH:mm:ss"));
        let itemCampanaList = campana.itemsCampana.filter(x => x.distrito.provincia.nombre.trim() === 'Lima');

        
        if (itemCampanaList.length > 0){
            
            fechaProvincia = moment(new Date(fechaDistribucion.setDate(fechaDistribucion.getDate() + r.plazo))).format("DD-MM-YYYY");
        }
        return fechaProvincia;
    }

}   