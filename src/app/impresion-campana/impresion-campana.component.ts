import { Component, OnInit } from '@angular/core';
import { TituloService } from '../services/titulo.service';
import { CampanaService } from '../services/campana.service';
import { AppSettings } from '../settings/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { Campana } from '../model/campana.model';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TrackingCampanaComponent } from '../modals/tracking-campana/tracking-campana.component';
import { EstadoCampanaEnum } from '../enum/estadocampana.enum';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { MensajeExitoComponent } from '../modals/mensaje-exito/mensaje-exito.component';
import { DatosRecojoComponent } from './datos-recojo/datos-recojo.component';
import { ProveedorImpresion } from '../model/proveedorimpresion.model';
import { ItemCampana } from './../model/itemcampana.model';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-impresion-campana',
  templateUrl: './impresion-campana.component.html',
  styleUrls: ['./impresion-campana.component.css']
})
export class ImpresionCampanaComponent implements OnInit {

  constructor(
    private tituloService: TituloService,
    private campanaService: CampanaService,
    private modalService: BsModalService
  ) { }

  settings = Object.assign({}, AppSettings.tableSettings);
  dataCampanasConMuestraAceptada: LocalDataSource = new LocalDataSource();
  prefijo = AppSettings.PREFIJO;
  campanas: Campana[] = [];
  campana: Campana;                   //muestra_aceptada 12 - GEOREFERENCIADA //impresion_iniciada 14 - CONFORMIDAD_ACEPTADA
  estadosCampana: number[] = [EstadoCampanaEnum.MUESTRA_ACEPTADA, EstadoCampanaEnum.IMPRESION_INICIADA];

  ngOnInit() {
    this.tituloService.setTitulo("Impresión de Campañas");
    this.settings.columns = {
      linkTracking: {
        title: 'Tracking',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-clipboard-list";
          instance.pressed.subscribe(row => {
            this.visualizarSeguimiento(row);
          });
        }
      },
      id: {
        title: 'Código de campaña'
      },
      nombre: {
        title: 'Nombre de campaña'
      },
      solicitante: {
        title: 'Solicitante'
      },
      areaSolicitante: {
        title: 'Área solicitante'
      },
      tipoCampana: {
        title: 'Tipo de campaña'
      },
      tipoDestino: {
        title: 'Tipo de destino'
      },
      tipoDocumento: {
        title: 'Tipo de documento'
      },
      cantidadLima: {
        title: 'Cantidad Lima'
      },
      cantidadProvincia: {
        title: 'Cantidad Provincia'
      },
      fechaSolicitudImpresion: {
        title: 'Fecha de solicitud de impresión'
      },
      fechaInicioImpresion: {
        title: 'Fecha de Inicio de impresión'
      },
      estado: {
        title: 'Estado'
      },
      inicioImpresion: {
        title: 'Iniciar impresión',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          if (this.campanas.length > 0){
            instance.mostrarData.subscribe(row => {
              let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
              let estado_id = this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.id;
              if (estado_id === 12) { //3-12
                instance.claseIcono = "fas fa-sign-in-alt";
              }
            });
          }
          instance.pressed.subscribe(row => {
            this.iniciarImpresion(row);
          });
        }
      },

      envioDatosRecojo: {
        title: 'Enviar datos de recojo al proveedor',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          if (this.campanas.length > 0){
            instance.mostrarData.subscribe(row => {
              let campana = this.campanas.find(x => x.id === this.campanaService.extraerIdAutogenerado(row.id));
              let estado_id = this.campanaService.getUltimoSeguimientoCampana(campana).estadoCampana.id;
              if (estado_id === 14) {
                instance.claseIcono = "fas fa-calendar-alt";
              }
            });
          }
          instance.pressed.subscribe(row => {
            this.enviarDatosRecojo(row);
          });
        }
      },
    };
    this.listarCampanasConMuestrasAceptadas();
  }

  listarCampanasConMuestrasAceptadas() {
    this.dataCampanasConMuestraAceptada = new LocalDataSource();
    this.campanas = [];
    this.campanaService.listarCampanasPorEstados(this.estadosCampana).subscribe(
      campanasas => {
        this.campanas = campanasas;
        let dataCampanasConMuestraAceptada = [];
        campanasas.forEach(campanasis => {

          let campana_u = this.campanaService.getUltimoSeguimientoCampana(campanasis);
          let fecha_estado = campana_u.fecha;
          let fecha_inicio_impresion = fecha_estado;

          if (campana_u.estadoCampana.id === 12){
            fecha_inicio_impresion = "";
          } 

          dataCampanasConMuestraAceptada.push({
            id: this.campanaService.codigoAutogenerado(campanasis.id, this.prefijo.DOCUMENTO),
            nombre: campanasis.nombre,
            solicitante: campanasis.buzon.nombre,
            areaSolicitante: campanasis.buzon.area.nombre,
            tipoCampana: campanasis.tipoCampana.nombre,
            tipoDestino: campanasis.tipoDestino.nombre,
            tipoDocumento: campanasis.tipoDocumento.nombre,
            //cantidad Lima / Provincia : Servicio se debe crear en el service
            cantidadLima: this.contarDocumentos(campanasis.itemsCampana.filter(x=> x.enviable==true),true),
            cantidadProvincia: this.contarDocumentos(campanasis.itemsCampana.filter(x=> x.enviable==true), false),
            fechaSolicitudImpresion: this.campanaService.getFechaMuestraAceptada(campanasis),
            fechaInicioImpresion: fecha_inicio_impresion,
            estado: this.campanaService.getUltimoSeguimientoCampana(campanasis).estadoCampana.nombre
          });
        });
        this.dataCampanasConMuestraAceptada.load(dataCampanasConMuestraAceptada);
      }
    )
  }

  contarDocumentos(documentos: ItemCampana[], lima: boolean = true, normalizado: boolean = false): number {
    return documentos.filter(documento => (documento.distrito.provincia.nombre.toUpperCase().trim() !== "LIMA" || lima) && (documento.distrito.provincia.nombre.toUpperCase().trim() === "LIMA" || !lima) && (documento.enviable || !normalizado)).length;    
  }

  visualizarSeguimiento(row) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingCampanaComponent, {
      initialState: {
        campana: this.campanas.find(campanax => campanax.id == this.campanaService.extraerIdAutogenerado(row.id))
      },
      class: 'modal-lg'
    })
  }

  iniciarImpresion(row) {
    this.campana = this.campanas.find(
      campanaq => campanaq.id == this.campanaService.extraerIdAutogenerado(row.id));
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Inicio de impresión - " + row.nombre,
        mensaje: "¿Está seguro de iniciar la impresión de la campaña?",
      },
      keyboard: false,
      backdrop: "static",
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.campanaService.iniciarImpresión(this.campana).subscribe(
        () => {
          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se ha iniciado la impresión correctamente"
            },
          });
          this.listarCampanasConMuestrasAceptadas();
        },
        error => {
          console.log('nuevo error');
        }
      )
    });
  }

  enviarDatosRecojo(row) {
    this.campana = this.campanas.find(campana => campana.id == this.campanaService.extraerIdAutogenerado(row.id));
    let bsModalRef: BsModalRef = this.modalService.show(DatosRecojoComponent, {
      initialState: {
        campana: this.campana,
        titulo: 'Adjuntar datos de recojo - ' + row.nombre,
        datoFecha: 'Fecha : ',
        datoHora: 'Hora : ',
        datoImprenta: 'Imprenta : ',
        datoDireccion: 'Dirección : ',
        datoContacto: 'Contacto : '
      },
      class: 'modal-sm',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.confirmarEvent.subscribe((formularioDatosRecojo) => {
     
      let proveedorImpresion: ProveedorImpresion = new ProveedorImpresion();
      let fechaActual = moment(new Date()).format('YYYY-MM-DD');

      console.log("fecha actual : " + fechaActual);
      console.log("fecha formulario : " + formularioDatosRecojo.datoFecha);

      if(fechaActual < formularioDatosRecojo.datoFecha){ //LA FECHA DE RECOJO DEBE SER MAYOR A LA FECHA ACTUAL

        proveedorImpresion.fechaRecojo = moment(new Date(formularioDatosRecojo.datoFecha + ' ' + formularioDatosRecojo.datoHora)).format('DD-MM-YYYY HH:mm:ss');
        proveedorImpresion.nombre = formularioDatosRecojo.datoImprenta,
        proveedorImpresion.direccion = formularioDatosRecojo.datoDireccion,
        proveedorImpresion.contacto = formularioDatosRecojo.datoContacto,
        console.log(proveedorImpresion);
  
        this.campana.proveedorImpresion = proveedorImpresion;
        this.campanaService.enviarDatosRecojo(this.campana).subscribe(//cambiar metodo
          () => {
            let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
              initialState: {
                mensaje: "Los datos de recojo se enviaron correctamente"
              }
            });
            this.listarCampanasConMuestrasAceptadas();
          },
          error => {
            console.log("error al enviar datos de recojo");
          }
        )
      }
      else{
        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState: {
            mensaje: "Fecha inválida : La fecha de recojo debe ser mayor a la actual."
          }
        });
      }
      

    })
  }

}
