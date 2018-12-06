import { Component, OnInit } from '@angular/core';
import { Plazo } from 'src/app/model/plazo.model';
import { PlazoService } from 'src/app/services/plazo.service';
import { TipoDocumento } from 'src/app/model/tipodocumento.model';
import { TipoDocumentoService} from 'src/app/services/tipodocumento.service';

@Component({
  selector: 'app-generar-campana-documento',
  templateUrl: './generar-campana-documento.component.html',
  styleUrls: ['./generar-campana-documento.component.css']
})
export class GenerarCampanaDocumentoComponent implements OnInit {

  constructor(private plazoService:PlazoService,
              private tipoDocumentoService:TipoDocumentoService) { }

  plazos:Plazo[]=[];
  tipoDocumentos:TipoDocumento[]=[];


  ngOnInit() {
    this.cargarDatosVista();
  }

  cargarDatosVista(){
    this.listarPlazos();
  }

  listarTipoDocumentos(){
    this.tipoDocumentoService.listarAll().subscribe(
      tipoDocumentos => {this.tipoDocumentos = tipoDocumentos}
    )
  }

  listarPlazos(){
    this.plazoService.listarAll().subscribe(
      plazos => {this.plazos = plazos}
    )
  }

}
