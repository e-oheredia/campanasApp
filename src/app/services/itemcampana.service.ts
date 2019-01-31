import { Injectable } from '@angular/core';
import { ItemCampana } from './../model/itemcampana.model';
import { Subscription } from 'rxjs';
import { Distrito } from './../model/distrito.model';
import { Provincia } from './../model/provincia.model';
import { Departamento } from './../model/departamento.model';
import { BuzonService } from './buzon.service';
import { UtilsService } from './utils.service';
import { DistritoService } from './distrito.service';
import { ProvinciaService } from './provincia.service';
import { DepartamentoService } from './departamento.service';
import { ReadExcelService } from './readexcel.service';
import { Campana } from '../model/campana.model';
import { CampanaService } from '../services/campana.service';
import { EstadoItemCampanaService } from './estadoitemcampana.service';
import { EstadoItemCampanaEnum } from '../enum/estadoitemcampana.enum';

@Injectable()
export class ItemCampanaService {

    constructor(
        private readExcelService: ReadExcelService,
        private departamentoService: DepartamentoService,
        private provinciaService: ProvinciaService,
        private distritoService: DistritoService,
        private utilsService: UtilsService,
        private buzonService: BuzonService,
        private campanaService: CampanaService,
        private estadoItemCampanaService: EstadoItemCampanaService
    ) {
        this.departamentosPeruSubscription = this.departamentoService.departamentosPeruChanged.subscribe(
            departamentosPeru => {
                this.departamentosPeru = departamentosPeru;
            }
        )
        this.provinciasSubscription = this.provinciaService.provinciasChanged.subscribe(
            provincias => {
                this.provincias = provincias;
            }
        )
        this.distritosSubscription = this.distritoService.distritosChanged.subscribe(
            distritos => {
                this.distritos = distritos;
            }
        )
    }

    itemsCampana = [];
    departamentosPeru: Departamento[];
    provincias: Provincia[];
    distritos: Distrito[];

    departamentosPeruSubscription: Subscription;
    provinciasSubscription: Subscription;
    distritosSubscription: Subscription;

    mostrarItemsCampanaCargados(file: File, sheet: number, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let itemsCampanaCargados: ItemCampana[] = [];
            let i = 1
            while (true) {

                if (data[i] === undefined || data[i].length === 0) {
                    break;
                }
                let itemCampanaCargado: ItemCampana = new ItemCampana();
                itemCampanaCargado.razonSocial = data[i][0] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][1])) {
                    callback({
                        mensaje: "Ingrese el apellido Paterno en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.apellidoPaterno = data[i][1] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][2])) {
                    callback({
                        mensaje: "Ingrese el apellido Materno en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.apellidoMaterno = data[i][2] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][3])) {
                    callback({
                        mensaje: "Ingrese los nombres en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.nombres = data[i][3] || "";

                if (this.departamentoService.listarDepartamentoByNombre(data[i][4]) === null) {
                    callback({
                        mensaje: "Ingrese Departamento válido en la fila " + (i + 1)
                    });
                    return;
                }

                if (this.provinciaService.listarProvinciaByNombreProvinciaAndNombreDepartamento(data[i][5], data[i][4]) === null) {
                    callback({
                        mensaje: "Ingrese Provincia válida en la fila " + (i + 1)
                    });
                    return;
                }

                let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][6], data[i][5])

                if (distrito === null) {
                    callback({
                        mensaje: "Ingrese Distrito válido en la fila " + (i + 1)
                    });
                    return;
                }

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][7])) {
                    callback({
                        mensaje: "Ingrese la dirección en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.distrito = distrito;
                itemCampanaCargado.direccion = data[i][7] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][8])) {
                    callback({
                        mensaje: "Ingrese el IDC en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.idc = data[i][8];

                itemCampanaCargado.correlativoBase = i;

                itemsCampanaCargados.push(itemCampanaCargado);
                i++;
            }

            callback(itemsCampanaCargados);

        });
    }

    mostrarItemsCampanaBase(file: File, sheet: number, campana: Campana, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {

            if (campana.itemsCampana.filter(x=> x.enviable == false).length != data.length - 1) {
                callback({
                    mensaje: "Error, la base cuenta con más registros "
                });
                return;
            }

            if (this.utilsService.isUndefinedOrNullOrEmpty(data[0][1]) || this.utilsService.isUndefinedOrNullOrEmpty(data[0][10])) {
                callback({
                    mensaje: "Error, el formato de la base es incorrecto "
                });
                return;
            }

            let itemsCampanaCargados: ItemCampana[] = [];
            let i = 1
            while (true) {

                if (data.length == i) {
                    break;
                }
                if (data[i].length === 0) {
                    break;
                }

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][0])) {
                    callback({
                        mensaje: "Ingrese el código de documento en la fila " + (i + 1)
                    });
                    return;
                }

                let item: ItemCampana = campana.itemsCampana.find(x => x.id === data[i][0]);

                if (this.utilsService.isUndefinedOrNullOrEmpty(item)) {
                    callback({
                        mensaje: "El código de item de la fila " + (i + 1) + " no corresponde a la campaña seleccionada"
                    });
                    return;
                }
       
                let itemCampanaCargado: ItemCampana = new ItemCampana();
                itemCampanaCargado.id = data[i][0];
                let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][9], data[i][8])
                itemCampanaCargado.distrito = distrito;
                itemCampanaCargado.direccion = data[i][10] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][12])) {
                    callback({
                        mensaje: "Ingrese el estado del documento en la fila " + (i + 1)
                    });
                    return;
                }
                
                if (data[i][12].toUpperCase() != "Normalizado".toUpperCase() && data[i][12].toUpperCase() != "No distribuible".toUpperCase()) {
                    callback({
                        mensaje: "Ingrese correctamente el estado del documento en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.enviable = data[i][12].toUpperCase() === "Normalizado".toUpperCase() ? true : false;
                itemCampanaCargado.correlativoBase = data[i][2];
                itemsCampanaCargados.push(itemCampanaCargado);
                i++;
            }

            callback(itemsCampanaCargados);

        });
    }

    mostrarItemsReporte(file: File, sheet: number, campana: Campana, callback: Function){
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {

            let iCampanas : ItemCampana[] = [];

            if(campana.requiereGeorreferencia == true){
                iCampanas = campana.itemsCampana.filter(x=> x.enviable == true);
            }
            else{
                iCampanas = campana.itemsCampana;
            }

            if(iCampanas.length != data.length - 1){
                callback({
                    mensaje: "Error, la base cuenta con más registros"
                });
                return;
            }

            console.log("campana.itemsCampana.length " + campana.itemsCampana.length);
            console.log("data.length " + data.length);

            //VALIDAR cabezas                                //cabecera A=0
            if(this.utilsService.isUndefinedOrNullOrEmpty(data[0][0]) || this.utilsService.isUndefinedOrNullOrEmpty(data[0][13]) || this.utilsService.isUndefinedOrNullOrEmpty(data[0][14])){
                callback({
                    mensaje: "Error, el formato de la base es incorrecto"
                });
                return;
            }

            let itemsCampanaCargados: ItemCampana[] = [];
            let i = 1

            while (true) {
                if(data.length == 1){
                    break;
                }

                if(this.utilsService.isUndefinedOrNullOrEmpty(data[i])){
                    break;
                }

                if(this.utilsService.isUndefinedOrNullOrEmpty(data[i][0])){
                    callback({
                        mensaje: "Ingrese el código de item en la fila " + (i + 1)
                    });
                    return;
                }

                let item: ItemCampana = campana.itemsCampana.find(x => x.id === data[i][0]);
                if(this.utilsService.isUndefinedOrNullOrEmpty(item)){
                    callback({
                        mensaje: "El código de item de la fila " + (i + 1) + " no corresponde a la campaña seleccionada"
                    });
                    return;
                }

                let itemCampanaCargado: ItemCampana = new ItemCampana();
                itemCampanaCargado.id = data[i][0];
                
                if(this.utilsService.isUndefinedOrNullOrEmpty(data[i][13])){
                    callback({
                        mensaje: "Ingrese el estado del documento en la fila " + (i + 1)
                    });
                    return;
                }
                
                let estadosItemCampana = this.estadoItemCampanaService.getEstadosItemCampana();
                console.log("estadosItemCampana : " + estadosItemCampana.length);

                let estadoItemCampana = estadosItemCampana.find(estadoItemCampana => estadoItemCampana.nombre.toUpperCase().trim() === data[i][13].toUpperCase().trim());

                if(estadoItemCampana === null){
                    callback({
                        mensaje: "Ingrese correctamente el estado del documento en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.estadoItemCampana = estadoItemCampana;

                
                if((estadoItemCampana.id === EstadoItemCampanaEnum.ENTREGADO || estadoItemCampana.id === EstadoItemCampanaEnum.REZAGADO) && this.utilsService.isUndefinedOrNullOrEmpty(data[i][14])){
                    callback({
                        mensaje: "Ingrese el detalle del estado en la fila " + (i + 1)
                    });
                    return;
                    
                }
                
                itemCampanaCargado.detalle = data[i][14] || "";
                
                itemsCampanaCargados.push(itemCampanaCargado);
                i++;
            }
            callback(itemsCampanaCargados);
        });
    }//------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    mostrarItemsPorModificar(file: File, sheet: number, campana: Campana, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {

            if (campana.itemsCampana.filter(x=> x.enviable == false).length != data.length - 1) {
                callback({
                    mensaje: "Error, la base cuenta con mas registros "
                });
                return;
            }

            if (this.utilsService.isUndefinedOrNullOrEmpty(data[0][0]) || this.utilsService.isUndefinedOrNullOrEmpty(data[0][7])
            || this.utilsService.isUndefinedOrNullOrEmpty(data[0][8])|| this.utilsService.isUndefinedOrNullOrEmpty(data[0][9])|| 
            this.utilsService.isUndefinedOrNullOrEmpty(data[0][10])) {
                callback({
                    mensaje: "Error, el formato de la base es incorrecto "
                });
                return;
            }

            let itemsCampanaCargados: ItemCampana[] = [];
            let i = 1
            while (true) {

                if (data.length == i) {
                    break;
                }
                if (data[i].length === 0) {
                    break;
                }

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][0])) {
                    callback({
                        mensaje: "Ingrese el codigo de documento en la fila " + (i + 1)
                    });
                    return;
                }
                
                let item: ItemCampana = campana.itemsCampana.find(x => x.id === data[i][0]);

                if (this.utilsService.isUndefinedOrNullOrEmpty(item)) {
                    callback({
                        mensaje: "El código de item de la fila " + (i + 1) + " no corresponde a la campaña seleccionada"
                    });
                    return;
                }

                if(item.enviable == true){
                    callback({
                        mensaje: "El código de item de la fila " + (i + 1) + " ya se encuentra Normalizada"
                    });
                    return;
                }

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][10])) {
                    callback({
                        mensaje: "Ingrese una dirección en la fila " + (i + 1) 
                    });
                    return;
                }

                if (this.departamentoService.listarDepartamentoByNombre(data[i][7]) === null) {
                    callback({
                        mensaje: "Ingrese Departamento válido en la fila " + (i + 1)
                    });
                    return;
                }

                if (this.provinciaService.listarProvinciaByNombreProvinciaAndNombreDepartamento(data[i][8], data[i][7]) === null) {
                    callback({
                        mensaje: "Ingrese Provincia válida en la fila " + (i + 1)
                    });
                    return;
                }

                let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][9], data[i][8])

                if (distrito === null) {
                    callback({
                        mensaje: "Ingrese Distrito válido en la fila " + (i + 1)
                    });
                    return;
                }

                let itemCampanaCargado: ItemCampana = new ItemCampana();
                itemCampanaCargado.id = data[i][0];              
                itemCampanaCargado.correlativoBase = data[i][2];  
                itemCampanaCargado.distrito = distrito;
                itemCampanaCargado.direccion = data[i][10] || "";
                itemCampanaCargado.enviable = data[i][11] == "Normalizado" ? true : false;
                itemsCampanaCargados.push(itemCampanaCargado);
                i++;
            }

            callback(itemsCampanaCargados);

        });
    }

}