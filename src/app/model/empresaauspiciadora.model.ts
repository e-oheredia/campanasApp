import { Auspiciador } from './auspiciador.model';

export class EmpresaAuspiciadora extends Auspiciador {
    constructor(public id: number, public contacto:string, public direccion: String, public razonSocial: String , public ruc: String){
        super();
    }
}