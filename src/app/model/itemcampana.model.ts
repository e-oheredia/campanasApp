import { Distrito } from './distrito.model';
export class ItemCampana {
    constructor(){
    }

    public distrito: Distrito;
    public nombres: string;
    public apellidoPaterno: string;
    public apellidoMaterno: string;
    public direccion: string;
    public razonSocial: string;
    public enviable: boolean;
}