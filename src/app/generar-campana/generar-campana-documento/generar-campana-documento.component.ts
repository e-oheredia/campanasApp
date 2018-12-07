import { AppSettings } from './../../settings/app.settings';
import { UtilsService } from './../../services/utils.service';
import { ItemCampanaService } from './../../services/itemcampana.service';
import { ItemCampana } from '../../model/itemcampana.model';
import { Component, OnInit } from '@angular/core';

import { Plazo } from '../../model/plazo.model';
import { PlazoService } from '../../services/plazo.service';
import { TipoDocumento } from '../../model/tipodocumento.model';
import { TipoDocumentoService } from '../../services/tipodocumento.service';
import { TipoDestino } from '../../model/tipodestino.model';
import { TipoDestinoService } from '../../services/tipodestino.service';
import { PaqueteHabilitado } from '../../model/paquetehabilitado.model';
import { PaqueteHabilitadoService } from '../../services/paquetehabilitado.service';
import { TipoAgrupado } from '../../model/tipoagrupado.model';
import { TipoAgrupadoService } from '../../services/tipoagrupado.service';
import { AccionRestosProveedor } from '../../model/accionrestosproveedor.model';
import { AccionRestosProveedorService } from '../../services/accionrestosproveedor.service';
import { CentroCostos } from 'src/app/model/centrocostos.model';
import { GrupoCentroCostos } from 'src/app/model/grupocentrocostos.model';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NotifierService } from '../../../../node_modules/angular-notifier';



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
    private utilsService: UtilsService,
    private notifier: NotifierService
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

  columnsItemsCampanaCargados = {
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
      'cliLima': new FormControl("", Validators.required),
      'cliProvincia': new FormControl("", Validators.required),
      'colLima': new FormControl("", Validators.required),
      'colProvincia': new FormControl("", Validators.required),
      'imprenta': new FormControl("", Validators.required),
      'direccion': new FormControl("", Validators.required),
      'contacto': new FormControl("", Validators.required),
      'fechaHoraRecojo': new FormControl("", Validators.required),
      'contactoRezago': new FormControl("", Validators.required),
      'direccionRezago': new FormControl("", Validators.required),
      'observacionRezago': new FormControl("", Validators.required),
      'contactoCargo': new FormControl("", Validators.required),
      'direccionCargo': new FormControl("", Validators.required),
      'observacionCargo': new FormControl("", Validators.required),
      'accionporcargos': new FormControl("", Validators.required),
      'costoCampana': new FormControl(),
      'cuentaContable': new FormControl("", [this.requiredIfCentroCostoBCP.bind(this)]),
      'centroCostos': new FormControl("", [this.requiredIfCentroCostoBCP.bind(this)]),
      'ordenEstadistica': new FormControl("", [this.requiredIfCentroCostoBCP.bind(this)]),
      'grupoArticulo': new FormControl("", [this.requiredIfCentroCostoBCP.bind(this)]),
      'porcentajePago': new FormControl(1, [this.requiredIfCentroCostoBCP.bind(this)]),
      'razonSocialEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),
      'rucEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),
      'direccionEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),
      'contactoEmpresaAuspiciadora': new FormControl("", [this.requiredIfEmpresaAuspiciadora.bind(this)]),

    }, this.noDocumentsLoaded.bind(this));
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
      return;
    }

    let cc = new CentroCostos(null, this.campanaForm.get("cuentaContable").value, this.campanaForm.get("centroCostos").value, this.campanaForm.get("ordenEstadistica").value, this.campanaForm.get("grupoArticulo").value, this.campanaForm.get("porcentajePago").value);

    let p = 0;
    this.grupoCentroCostos.centroscostos.forEach(element => {
      p += element.porcentaje;
    });

    p += cc.porcentaje;

    if (p > 100) {
      return;
    }

    this.grupoCentroCostos.centroscostos.push(cc);

  }


  requiredIfEmpresaAuspiciadora(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || this.utilsService.isUndefinedOrNullOrEmpty(control.value)) {
      return { 'requiredIfEmpresaAuspiciadora': true }
    }

    return null;

  }

  requiredIfCentroCostoBCP(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.campanaForm) || this.utilsService.isUndefinedOrNullOrEmpty(control) || this.utilsService.isUndefinedOrNullOrEmpty(control.value)) {
      return { 'requiredIfCentroCostoBCP': true }
    }

    return null;

  }

}
