import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CampanaService } from './../../services/campana.service';
import { PaqueteHabilitado } from 'src/app/model/paquetehabilitado.model';
import { TipoDestino } from 'src/app/model/tipodestino.model';
import { Campana } from './../../model/campana.model';
import { GrupoCentroCostos } from './../../model/grupocentrocostos.model';
import { CentroCostos } from './../../model/centrocostos.model';
import { AppSettings } from './../../settings/app.settings';
import { UtilsService } from './../../services/utils.service';
import { ItemCampanaService } from './../../services/itemcampana.service';
import { ItemCampana } from '../../model/itemcampana.model';
import { Component, OnInit } from '@angular/core';

import { Plazo } from '../../model/plazo.model';
import { PlazoService } from '../../services/plazo.service';
import { TipoDocumento } from '../../model/tipodocumento.model';
import { TipoDocumentoService } from '../../services/tipodocumento.service';
import { TipoDestinoService } from '../../services/tipodestino.service';
import { PaqueteHabilitadoService } from '../../services/paquetehabilitado.service';
import { TipoAgrupado } from '../../model/tipoagrupado.model';
import { TipoAgrupadoService } from '../../services/tipoagrupado.service';
import { AccionRestosProveedor } from '../../model/accionrestosproveedor.model';
import { AccionRestosProveedorService } from '../../services/accionrestosproveedor.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NotifierService } from '../../../../node_modules/angular-notifier';

import * as moment from "moment-timezone";
import { MensajeExitoComponent } from '../../modals/mensaje-exito/mensaje-exito.component';



@Component({
  selector: 'app-generar-campana-documento',
  templateUrl: './generar-campana-documento.component.html',
  styleUrls: ['./generar-campana-documento.component.css']
})
export class GenerarCampanaDocumentoComponent implements OnInit {

  constructor(private plazoService: PlazoService,
    private tipoDocumentoService: TipoDocumentoService,
    private tipoDestinoService: TipoDestinoService,
    private paqueteHabilitadoService: PaqueteHabilitadoService,
    private tipoAgrupadoService: TipoAgrupadoService,
    private accionRestosProveedorService: AccionRestosProveedorService,
    private itemCampanaService: ItemCampanaService,
    public utilsService: UtilsService,
    private notifier: NotifierService, 
    private campanaService: CampanaService,
    private modalService: BsModalService
  ) { }

  campanaForm: FormGroup;

  plazos: Plazo[] = [];
  tiposDocumento: TipoDocumento[] = [];
  tiposDestino: TipoDestino[] = [];
  paqueteHabilitados: PaqueteHabilitado[] = [];
  tiposAgrupado: TipoAgrupado[] = [];
  accionesRestosProveedor: AccionRestosProveedor[] = [];
  itemsCampanaCargados: ItemCampana[] = [];
  dataItemsCampanaCargados: LocalDataSource = new LocalDataSource();
  excelFile: File;
  tableSettings = AppSettings.tableSettings;
  centroCostosList: CentroCostos[] = [];
  grupoCentroCostos: GrupoCentroCostos;
  tiposAgrupadoElegidos: TipoAgrupado[] = [];
  rutaPlantilla: string = AppSettings.RUTA_PLANTILLA;

  columnsItemsCampanaCargados = {
    correlativo: {
      title: 'Correlativo'
    },
    razonSocial: {
      title: 'Razón Social'
    },
    apellidoPaterno: {
      title: 'Apellido Paterno'
    },
    apellidoMaterno: {
      title: 'Apellido Materno'
    },
    nombres: {
      title: 'Nombres'
    },
    departamento: {
      title: 'Departamento'
    },
    provincia: {
      title: 'Provincia'
    },
    distrito: {
      title: 'Distrito'
    },
    direccion: {
      title: 'Dirección'
    }
  };


  //: number = 1; //1 BCP - 2 OTROS

  selectCCOO: boolean = true;

  ngOnInit() {
    this.tableSettings.columns = this.columnsItemsCampanaCargados;
    this.cargarVista();
    this.campanaForm = new FormGroup({
      'nombreCampana': new FormControl("", Validators.required),
      'imprenta': new FormControl("", [this.requiredIfRequiereImpresion.bind(this)]),
      'direccion': new FormControl("", [this.requiredIfRequiereImpresion.bind(this)]),
      'contacto': new FormControl("", [this.requiredIfRequiereImpresion.bind(this)]),
      'fechaHoraRecojo': new FormControl("", [this.requiredIfRequiereImpresion.bind(this)]),
      'contactoRezago': new FormControl("", [this.requiredIfRequiereDevolucionRezago.bind(this)]),
      'direccionRezago': new FormControl("", [this.requiredIfRequiereDevolucionRezago.bind(this)]),
      'observacionRezago': new FormControl("", [this.requiredIfRequiereDevolucionRezago.bind(this)]),
      'contactoCargo': new FormControl("", [this.requiredIfRequiereDevolucionCargo.bind(this)]),
      'direccionCargo': new FormControl("", [this.requiredIfRequiereDevolucionCargo.bind(this)]),
      'observacionCargo': new FormControl("", [this.requiredIfRequiereDevolucionCargo.bind(this)]),
      'accionporcargos': new FormControl("",  [this.requiredIfNotRequiereDevolucionCargo.bind(this)]),
      'tipoDocumento': new FormControl(null, Validators.required),
      'requiereGps': new FormControl(true, Validators.required),
      'plazo': new FormControl(null, Validators.required),
      'tipoDestino': new FormControl(null, Validators.required),
      'requiereGeorreferenciacion': new FormControl(true, Validators.required),
      'requiereImpresion': new FormControl(false, Validators.required),
      'requiereHabilitado': new FormControl(true, Validators.required),
      'paqueteHabilitado': new FormControl(null, [this.requiredIfRequiereHabilitado.bind(this)]),
      'requiereCentroCostoBCP': new FormControl(true, Validators.required),      
      'requiereDevolucionRezago': new FormControl(true, Validators.required),
      'accionporrezagos': new FormControl(null, [this.requiredIfNotRequiereDevolucionRezago.bind(this)]),
      'requiereDevolucionCargo': new FormControl(true, Validators.required),
      'regulatorio': new FormControl(true, Validators.required),
      'costoCampana': new FormControl(),
      'cuentaContable': new FormControl(""),
      'centroCostos': new FormControl(""),
      'ordenEstadistica': new FormControl(""),
      'grupoArticulo': new FormControl(""),
      'porcentajePago': new FormControl(null),
      'razonSocialEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),
      'rucEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),
      'direccionEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),
      'contactoEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),
      'archivoExcel': new FormControl(null)
    }, [this.noDocumentsLoaded.bind(this), this.porcentajeCompletoSiRequiereCentroCostosBCP.bind(this)]);
    this.grupoCentroCostos = new GrupoCentroCostos(this.centroCostosList);

  }

  cargarVista() {
    this.listarTiposDocumento();
    this.listarPlazos();
    this.listarTiposDestino();
    this.listarHabilitados();
    this.listarTiposAgrupado();
    this.listarAccionRestosProveedor();
    this.grupoCentroCostos = new GrupoCentroCostos(this.centroCostosList);
  }

  listarTiposDocumento() {
    this.tipoDocumentoService.listarAll().subscribe(
      tiposdocumento => { this.tiposDocumento = tiposdocumento }
    )
  }

  listarPlazos() {
    this.plazoService.listarAll().subscribe(
      plazos => { this.plazos = plazos }
    )
  }

  listarTiposDestino() {
    this.tipoDestinoService.listarAll().subscribe(
      tiposdestino => { this.tiposDestino = tiposdestino }
    )
  }

  listarHabilitados() {
    this.paqueteHabilitadoService.listarAll().subscribe(
      paquetehabilitado => { this.paqueteHabilitados = paquetehabilitado }
    )
  }

  listarTiposAgrupado() {
    this.tipoAgrupadoService.listarAll().subscribe(
      tiposagrupado => { this.tiposAgrupado = tiposagrupado }
    )
  }

  listarAccionRestosProveedor() {
    this.accionRestosProveedorService.listarAll().subscribe(
      accionesrestoproveedor => { this.accionesRestosProveedor = accionesrestoproveedor }
    )
  }




  noDocumentsLoaded(form: FormGroup): { [key: string]: boolean } | null {
    if (this.itemsCampanaCargados.length == 0) {
      return { 'noDocumentsLoaded': true }
    }
    return null;
  }

  onChangeExcelFile(file: File) {
    if (file == null) {
      this.excelFile = null;
      this.dataItemsCampanaCargados = new LocalDataSource();
      this.itemsCampanaCargados = [];
      return null;
    }
    this.excelFile = file;
    this.importarExcel();
  }

  importarExcel() {
    if (this.excelFile == null) {
      this.dataItemsCampanaCargados = new LocalDataSource();
      this.itemsCampanaCargados = [];
      return null;
    }
    this.mostrarItemsCampanaCargados(this.excelFile);
  }

  mostrarItemsCampanaCargados(file: File) {
    this.dataItemsCampanaCargados.reset();
    this.itemsCampanaCargados = [];
    this.itemCampanaService.mostrarItemsCampanaCargados(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.itemsCampanaCargados = data;
        let dataItemsCampanaCargados = [];
        data.forEach(element => {
          dataItemsCampanaCargados.push({
            correlativo: element.correlativo,
            departamento: element.distrito.provincia.departamento.nombre,
            provincia: element.distrito.provincia.nombre,
            distrito: element.distrito.nombre,
            nombres: element.nombres,
            apellidoPaterno: element.apellidoPaterno,
            apellidoMaterno: element.apellidoMaterno,
            direccion: element.direccion,
            razonSocial: element.razonSocial
          })
        });
        this.dataItemsCampanaCargados.load(dataItemsCampanaCargados);
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }

  mostrar = true;

  agregarCentroCostoItem() {
    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) ||
      this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm.get('cuentaContable').value) ||
      this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm.get('centroCostos').value) ||
      this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm.get('ordenEstadistica').value) ||
      this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm.get('grupoArticulo').value) ||
      this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm.get('porcentajePago').value)
    ) {
      this.notifier.notify("warning", "Ingrese todos los campos correctamente");
      return;
    }

    let cc = new CentroCostos(null, this.campanaForm.get("cuentaContable").value, this.campanaForm.get("centroCostos").value, this.campanaForm.get("ordenEstadistica").value, this.campanaForm.get("grupoArticulo").value, this.campanaForm.get("porcentajePago").value);

    let p = 0;
    this.grupoCentroCostos.centrosCostos.forEach(element => {
      p += element.porcentaje;
    });

    p += cc.porcentaje;

    if (p > 100) {
      return;
    }

    this.grupoCentroCostos.centrosCostos.push(cc);
    this.campanaForm.controls["cuentaContable"].reset();
    this.campanaForm.controls["centroCostos"].reset();
    this.campanaForm.controls["ordenEstadistica"].reset();
    this.campanaForm.controls["grupoArticulo"].reset();
    this.campanaForm.controls["porcentajePago"].reset();
  }


  requiredIfEmpresaAuspiciadora(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereCentroCostoBCP").value === false ) {
      return { 'requiredIfEmpresaAuspiciadora': true }
    }

    return null;

  }

  requiredIfCentroCostoBCP(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereCentroCostoBCP").value === true ) {
      return { 'requiredIfCentroCostoBCP': true }
    }

    return null;

  }

  requiredIfRequiereImpresion(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereImpresion").value === true )   {
      return { 'requiredIfRequiereImpresion': true }
    }

    return null;

  }

  requiredIfRequiereHabilitado(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereHabilitado").value === true )   {
      return { 'requiredIfRequiereHabilitado': true }
    }

    return null;
  }

  requiredIfRequiereDevolucionRezago(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereDevolucionRezago").value === true )   {
      return { 'requiredIfRequiereHabilitado': true }
    }

    return null;
  }

  requiredIfRequiereDevolucionCargo(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereDevolucionCargo").value === true )   {
      return { 'requiredIfRequiereHabilitado': true }
    }

    return null;
  }
  

  requiredIfNotRequiereDevolucionCargo(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereDevolucionCargo").value === false )   {
      return { 'requiredIfRequiereHabilitado': true }     
      
    }

    return null;
  }
  

  requiredIfNotRequiereDevolucionRezago(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || (this.utilsService.isUndefinedOrNullOrEmpty(control.value)) && this.campanaForm.get("requiereDevolucionRezago").value === false )   {
      return { 'requiredIfRequiereHabilitado': true }
      
    }
    return null;    
  }

  porcentajeCompletoSiRequiereCentroCostosBCP(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || (this.utilsService.getSumaAtributoLista(this.grupoCentroCostos.centrosCostos, "porcentaje") < 100 && this.campanaForm.get("requiereCentroCostoBCP").value === true )) {
      return { 'porcentajeCompletoSiRequiereCentroCostosBCP': true }
    }

    return null;  
  }

  registrarCampana(values: any) {
    console.log(this.campanaForm);
    let campana: Campana = new Campana();
    campana.itemsCampana = this.itemsCampanaCargados;
    campana.nombre = values.nombreCampana;
    campana.tipoDocumento = values.tipoDocumento;
    campana.regulatorio = values.regulatorio;
    campana.requiereGps = values.requiereGps;
    campana.plazo = values.plazo;
    campana.tipoDestino = values.tipoDestino;
    campana.requiereGeorreferencia = values.requiereGeorreferenciacion;
    campana.tiposAgrupado = this.tiposAgrupadoElegidos;
    if (values.imprenta !== null && values.imprenta !== "") {
      let proveedorImpresion = {
        nombre: values.imprenta,
        direccion: values.direccion,
        contacto: values.contacto,
        fechaRecojo: moment(values.fechaHoraRecojo).format("DD-MM-YYYY HH:mm:ss")
      }
      campana.proveedorImpresion = proveedorImpresion;
    }

    if (values.paqueteHabilitado !== null) {
      campana.paqueteHabilitado = values.paqueteHabilitado;
    }

    if (values.contactoRezago !== null && values.contactoRezago !== "") {
      campana.accionRestosRezagosCampana = {
        accionRestosCampana: {
          contacto: values.contactoRezago,
          direccion: values.direccionRezago,
          observacion: values.observacionRezago
        }
      };
    } else {
      campana.accionRestosRezagosCampana = {
        accionRestosCampana: {
          accionRestosProveedor: values.accionporrezagos
        }
      }
    }
    if (values.contactoCargo !== null) {
      campana.accionRestosCargosCampana = {
        accionRestosCampana: {
          contacto: values.contactoCargo,
          direccion: values.direccionCargo,
          observacion: values.observacionCargo
        }
      };
    } else {
      campana.accionRestosCargosCampana = {
        accionRestosCampana: {
          accionRestosProveedor: values.accionporcargos
        }
      }
    }   

    if (this.grupoCentroCostos.centrosCostos.length > 0) {
      campana.auspiciador = this.grupoCentroCostos;
    } else {
      campana.auspiciador = {
        contacto: values.contactoEmpresaAuspiciadora,
        direccion: values.direccionEmpresaAuspiciadora,
        razonSocial: values.razonSocialEmpresaAuspiciadora,
        ruc: values.rucEmpresaAuspiciadora
      }
    }

    this.campanaService.registrarCampana(campana).subscribe(
      (campanaCreada) => {
        
        this.campanaForm.reset();
        this.itemsCampanaCargados = [];
        this.tiposAgrupadoElegidos = [];
        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState : {
            mensaje: "Se ha creado correctamente la campaña con código " + this.campanaService.codigoAutogenerado(campanaCreada.id, AppSettings.PREFIJO.DOCUMENTO) }
        });
      }
    )
  }

  onChangeRequiereImpresion(value) {
    if (!value) {
      this.campanaForm.controls['imprenta'].setValue(null);
      this.campanaForm.controls['direccion'].setValue(null);
      this.campanaForm.controls['contacto'].setValue(null);
      this.campanaForm.controls['fechaHoraRecojo'].setValue(null);
      this.campanaForm.controls['contactoRezago'].setValue(null);
    }
  }

  onChangeRequiereHabilitado(value) {
    if (!value) {
      this.campanaForm.controls['paqueteHabilitado'].setValue(null);
    }
  }

  onChangeRequiereDevolucionRezago(value) {
    if (!value) {
      this.campanaForm.controls['contactoRezago'].setValue(null);
      this.campanaForm.controls['direccionRezago'].setValue(null);
      this.campanaForm.controls['observacionRezago'].setValue(null);
    }else{
      this.campanaForm.controls['accionporrezagos'].setValue(null);
    }
  }

  onChangeRequiereDevolucionCargo(value) {
    if (!value) {
      this.campanaForm.controls['contactoCargo'].setValue(null);
      this.campanaForm.controls['direccionCargo'].setValue(null);
      this.campanaForm.controls['observacionCargo'].setValue(null);
    }else{
      this.campanaForm.controls['accionporcargos'].setValue(null);
    }
  }

  onChangeRequiereCentroCostoBCP(value) {
    if (!value) {
      this.grupoCentroCostos.centrosCostos = [];
      this.centroCostosList = [];
      this.campanaForm.controls['cuentaContable'].setValue(null);
      this.campanaForm.controls['centroCostos'].setValue(null);
      this.campanaForm.controls['ordenEstadistica'].setValue(null);
      this.campanaForm.controls['grupoArticulo'].setValue(null);
      this.campanaForm.controls['porcentajePago'].setValue(null);
    }else{
      this.campanaForm.controls['razonSocialEmpresaAuspiciadora'].setValue(null);
      this.campanaForm.controls['rucEmpresaAuspiciadora'].setValue(null);
      this.campanaForm.controls['direccionEmpresaAuspiciadora'].setValue(null);
      this.campanaForm.controls['contactoEmpresaAuspiciadora'].setValue(null);
    }
  }

  onChangeTipoDestino(value: TipoDestino) {
    if (value.nombre.toUpperCase() === "EXTERNA") {
      this.tiposAgrupadoElegidos = [];      
    }else{
      this.campanaForm.controls['requiereGeorreferenciacion'].setValue(false);
    }
  }

  onChangeTipoAgrupadoElegido(event: any, tipoAgrupado: TipoAgrupado) {
    
    event.srcElement.checked ? this.tiposAgrupadoElegidos.push(tipoAgrupado) : this.tiposAgrupadoElegidos.splice(this.tiposAgrupadoElegidos.indexOf(tipoAgrupado), 1);

  }

  contarDocumentosDeLima(documentos: ItemCampana[]): number {
    return documentos.filter(documento => documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA").length;    
  }

  onChangeGrupoCentroCostos(i: number){
    this.grupoCentroCostos.centrosCostos.splice(i,1);
    //this.grupoCentroCostos.centrosCostos.pop();
    this.campanaForm.controls["cuentaContable"].reset();
    this.campanaForm.controls["centroCostos"].reset();
    this.campanaForm.controls["ordenEstadistica"].reset();
    this.campanaForm.controls["grupoArticulo"].reset();
    this.campanaForm.controls["porcentajePago"].reset();
  }

}
