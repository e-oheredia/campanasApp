import { TipoProveedor } from './tipoproveedor.model';

export class Proveedor {
    constructor(public id: number, public nombre:string, public tipoProveedor: TipoProveedor){}
}