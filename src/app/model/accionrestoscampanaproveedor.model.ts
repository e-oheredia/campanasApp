import { AccionRestosProveedor } from './accionrestosproveedor.model';
import { AccionRestosCampana } from './accionrestoscampana.model';

export class AccionRestosCampanaProveedor extends AccionRestosCampana {
    
    constructor(public accionRestosProveedor: AccionRestosProveedor){
        super();
    }
}