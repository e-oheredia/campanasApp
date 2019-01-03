import { Distrito } from './distrito.model';
export class ItemCampana {
    constructor(){
    }

    public id : number;
    public distrito: Distrito;
    public nombres: string;
    public apellidoPaterno: string;
    public apellidoMaterno: string;
    public direccion: string;
    public razonSocial: string;
    public correlativo: number;
    public enviable: boolean;
}