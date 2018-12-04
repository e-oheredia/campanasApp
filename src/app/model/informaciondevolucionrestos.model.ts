import { AccionRestosCampana } from './accionrestoscampana.model';
export class InformacionDevolucionRestos extends AccionRestosCampana {
    constructor(public contacto:string, public direccion:string, public observacion:string){
        super();
    }
}