import { Component, OnInit } from '@angular/core';
import { Plazo } from 'src/app/model/plazo.model';
import { PlazoService } from 'src/app/services/plazo.service';
import { TipoDocumento } from 'src/app/model/tipodocumento.model';
import { TipoDocumentoService } from 'src/app/services/tipodocumento.service';
import { TipoDestino } from 'src/app/model/tipodestino.model';
import { TipoDestinoService } from 'src/app/services/tipodestino.service';
import { PaqueteHabilitado } from 'src/app/model/paquetehabilitado.model';
import { PaqueteHabilitadoService } from 'src/app/services/paquetehabilitado.service';
import { TipoAgrupado } from 'src/app/model/tipoagrupado.model';
import { TipoAgrupadoService } from 'src/app/services/tipoagrupado.service';
import { AccionRestosProveedor } from 'src/app/model/accionrestosproveedor.model';
import { AccionRestosProveedorService } from 'src/app/services/accionrestosproveedor.service';
import { CentroCostos } from 'src/app/model/centrocostos.model';
import { GrupoCentroCostos } from 'src/app/model/grupocentrocostos.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';



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
    private accionRestosProveedorService: AccionRestosProveedorService) { }



  campanaForm: FormGroup;

  plazos: Plazo[] = [];
  tiposDocumento: TipoDocumento[] = [];
  tiposDestino: TipoDestino[] = [];
  paqueteHabilitados: PaqueteHabilitado[] = [];
  tiposAgrupado: TipoAgrupado[] = [];
  accionesRestosProveedor: AccionRestosProveedor[] = [];
  
  centroCostosList : CentroCostos[] = [];
    
  grupoCentroCostos : GrupoCentroCostos;

  //: number = 1; //1 BCP - 2 OTROS

  selectCCOO : boolean = true;

  ngOnInit() {
    this.cargarVista();
    this.campanaForm = new FormGroup({
      'nombreCampana': new FormControl("", Validators.required),
      'costoCampana': new FormControl(),
      'cuentaContable' : new FormControl(),
      'centroCostos' : new FormControl(),
      'ordenEstadistica' : new FormControl(),
      'grupoArticulo' : new FormControl(),
      'porcentajePago' : new FormControl()
    })
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

  agregarCentroCostoItem() {

    let cc = new CentroCostos(null,this.campanaForm.get("cuentaContable").value,this.campanaForm.get("centroCostos").value,this.campanaForm.get("ordenEstadistica").value,this.campanaForm.get("grupoArticulo").value,this.campanaForm.get("porcentajePago").value);

    let p = 0;
    this.grupoCentroCostos.centroscostos.forEach(element => {
      p += element.porcentaje;
    });

    p += cc.porcentaje;

    if (p>100){
      return;
    }

    this.grupoCentroCostos.centroscostos.push(cc);
    
  }

}
