import { TipoCampana } from './tipocampana.model';
import { PaqueteHabilitado } from './paquetehabilitado.model';
import { ProveedorImpresion } from './proveedorimpresion.model';
import { SeguimientoCampana } from './seguimientocampana.model';
import { Auspiciador } from './auspiciador.model';
import { AccionRestosRezagosCampana } from './accionrestosrezagoscampana.model';
import { AccionRestosCargosCampana } from './accionrestoscargoscampana.model';
import { Proveedor } from './proveedor.model';
import { Buzon } from './buzon.model';
import { TipoDestino } from './tipodestino.model';
import { Plazo } from './plazo.model';
import { TipoDocumento } from './tipodocumento.model';
import { ItemCampana } from './itemcampana.model';
import { TipoAgrupado } from './tipoagrupado.model';
import { TipoEntrega } from './tipoentrega.model';

export class Campana {
    constructor(
        
    ){}   
    
    public id: number;
    public nombre: string;
    public regulatorio: boolean;
    public requiereGps: boolean;
    public requiereGeorreferencia: boolean;
    public autorizado: boolean;
    public plazo: Plazo;
    public tipoDestino: TipoDestino;
    public buzon: Buzon;
    public tipoDocumento: TipoDocumento;
    public rutaAutorizacion: string;
    public observacion: string;
    public proveedor: Proveedor;
    public accionRestosCargosCampana: AccionRestosCargosCampana | any;
    public accionRestosRezagosCampana: AccionRestosRezagosCampana | any;
    public auspiciador: Auspiciador | any;
    public itemsCampana: ItemCampana[];
    public seguimientosCampana: SeguimientoCampana[];
    public tiposAgrupado: TipoAgrupado[];
    public proveedorImpresion: ProveedorImpresion | any;
    public paqueteHabilitado: PaqueteHabilitado;
    public tipoCampana: TipoCampana;
    public costoCampana: number;
    public autogenerado: String;
    public rutaMuestra: String;
    public rutaGuia: string;
    public fechaDistribucion: Date;
    public tiposEntrega: TipoEntrega[];
}