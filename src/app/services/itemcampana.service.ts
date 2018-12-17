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

@Injectable()
export class ItemCampanaService {

    constructor(
        private readExcelService: ReadExcelService,
        private departamentoService: DepartamentoService,
        private provinciaService: ProvinciaService,
        private distritoService: DistritoService,
        private utilsService: UtilsService,
        private buzonService: BuzonService
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

                if (data[i].length === 0) {
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

                itemCampanaCargado.apellidoPaterno = data[i][2] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][2])) {
                    callback({
                        mensaje: "Ingrese el apellido Materno en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.apellidoMaterno = data[i][3] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][3])) {
                    callback({
                        mensaje: "Ingrese los nombres en la fila " + (i + 1)
                    });
                    return;
                }

                itemCampanaCargado.nombres = data[i][1] || "";

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

                itemCampanaCargado.distrito = distrito;
                itemCampanaCargado.direccion = data[i][7] || "";

              
                itemsCampanaCargados.push(itemCampanaCargado);
                i++;
            }

            callback(itemsCampanaCargados);

        });
    }

    mostrarItemsCampanaBase(file: File, sheet: number,  campana: Campana, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            
            if (campana.itemsCampana.length != data.length - 1){
                callback({
                    mensaje: "Error, la base cuenta con mas registros "
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

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][1])) {
                    callback({
                        mensaje: "Ingrese el codigo de documento en la fila " + (i + 1)
                    });
                    return;
                }

                let itemCampanaCargado: ItemCampana = new ItemCampana();
                itemCampanaCargado.id = data[i][1];
                
                //itemCampanaCargado.razonSocial = data[i][2] || "";
                //itemCampanaCargado.nombres = data[i][3] || "";
                //itemCampanaCargado.apellidoPaterno = data[i][4] || "";
                //itemCampanaCargado.apellidoMaterno = data[i][5] || "";
                //itemCampanaCargado.direccion = data[i][6] || "";

                let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][7], data[i][8])
                itemCampanaCargado.distrito = distrito;
                itemCampanaCargado.direccion = data[i][6] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][10])) {
                    callback({
                        mensaje: "Ingrese el estado del documento en la fila " + (i + 1)
                    });
                    return;
                }
               itemCampanaCargado.enviable = data[i][10] == "Normalizado" ? true: false;
                itemsCampanaCargados.push(itemCampanaCargado);
                i++;
            }

            callback(itemsCampanaCargados);

        });
    }

}