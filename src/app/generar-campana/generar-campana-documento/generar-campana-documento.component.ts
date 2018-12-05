import { Component, OnInit } from '@angular/core';
import { Plazo } from 'src/app/model/plazo.model';
import { PlazoService } from 'src/app/services/plazo.service';

@Component({
  selector: 'app-generar-campana-documento',
  templateUrl: './generar-campana-documento.component.html',
  styleUrls: ['./generar-campana-documento.component.css']
})
export class GenerarCampanaDocumentoComponent implements OnInit {

  constructor(private plazoService:PlazoService) { }

  plazos:Plazo[]=[];

  ngOnInit() {
    this.cargarDatosVista();
  }

  cargarDatosVista(){
    this.listarPlazos();
  }

  listarPlazos(){
    this.plazoService.listarAll().subscribe(
      plazos => {this.plazos = plazos}
    )
  }

}
