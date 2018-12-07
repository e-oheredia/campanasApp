import { Component, OnInit } from '@angular/core';
import { Plazo } from 'src/app/model/plazo.model';
import { PlazoService } from 'src/app/services/plazo.service';
import { TipoDocumento } from 'src/app/model/tipodocumento.model';
import { TipoDocumentoService} from 'src/app/services/tipodocumento.service';
import { TipoDestino } from 'src/app/model/tipodestino.model';
import { TipoDestinoService } from 'src/app/services/tipodestino.service';
import { PaqueteHabilitado } from 'src/app/model/paquetehabilitado.model';
import { PaqueteHabilitadoService } from 'src/app/services/paquetehabilitado.service';
import { TipoAgrupado } from 'src/app/model/tipoagrupado.model';
import { TipoAgrupadoService } from 'src/app/services/tipoagrupado.service';
import { AccionRestosProveedor } from 'src/app/model/accionrestosproveedor.model';
import { AccionRestosProveedorService } from 'src/app/services/accionrestosproveedor.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-generar-campana-documento',
  templateUrl: './generar-campana-documento.component.html',
  styleUrls: ['./generar-campana-documento.component.css']
})
export class GenerarCampanaDocumentoComponent implements OnInit {

  constructor(private plazoService:PlazoService,
              private tipoDocumentoService:TipoDocumentoService,
              private tipoDestinoService:TipoDestinoService,
              private paqueteHabilitadoService:PaqueteHabilitadoService,
              private tipoAgrupadoService:TipoAgrupadoService,
              private accionRestosProveedorService:AccionRestosProveedorService) { }



  campanaForm: FormGroup;
              
  plazos:Plazo[]=[];
  tiposDocumento:TipoDocumento[]=[];
  tiposDestino:TipoDestino[]=[];
  paqueteHabilitados:PaqueteHabilitado[]=[];
  tiposAgrupado:TipoAgrupado[]=[];
  accionesRestosProveedor:AccionRestosProveedor[]=[];


  ngOnInit() {
    this.cargarVista();
    this.campanaForm = new FormGroup({
      'nombreCampana' : new FormControl("", Validators.required),
      'cliLima' : new FormControl("", Validators.required),
      'cliProvincia' : new FormControl("", Validators.required),
      'colLima' : new FormControl("", Validators.required),
      'colProvincia' : new FormControl("", Validators.required),
      'imprenta' : new FormControl("", Validators.required),
      'direccion' : new FormControl("", Validators.required),
      'contacto' : new FormControl("", Validators.required),
      'fechaHoraRecojo' : new FormControl("", Validators.required),
      'contactoRezago' : new FormControl("", Validators.required),
      'direccionRezago' : new FormControl("", Validators.required),
      'observacionRezago' : new FormControl("", Validators.required),
      'contactoCargo' : new FormControl("", Validators.required),
      'direccionCargo' : new FormControl("", Validators.required),
      'observacionCargo' : new FormControl("", Validators.required),
    })
  }

  cargarVista(){
    this.listarTiposDocumento();
    this.listarPlazos();
    this.listarTiposDestino();
    this.listarHabilitados();
    this.listarTiposAgrupado();
    this.listarAccionRestosProveedor();
  }


  listarTiposDocumento(){
    this.tipoDocumentoService.listarAll().subscribe(
      tiposdocumento => {this.tiposDocumento = tiposdocumento}
    )
  }

  listarPlazos(){
    this.plazoService.listarAll().subscribe(
      plazos => {this.plazos = plazos}
    )
  }

  listarTiposDestino(){
    this.tipoDestinoService.listarAll().subscribe(
      tiposdestino => { this.tiposDestino = tiposdestino}
    )
  }

  listarHabilitados(){
    this.paqueteHabilitadoService.listarAll().subscribe(
      paquetehabilitado => { this.paqueteHabilitados = paquetehabilitado}
    )
  }
  
  listarTiposAgrupado(){
    this.tipoAgrupadoService.listarAll().subscribe(
      tiposagrupado => { this.tiposAgrupado = tiposagrupado}
    )
  }

  listarAccionRestosProveedor(){
    this.accionRestosProveedorService.listarAll().subscribe(
      accionesrestoproveedor => { this.accionesRestosProveedor = accionesrestoproveedor}
    )
  }



}
