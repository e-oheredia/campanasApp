import { Distrito } from './distrito.model';
import { EstadoItemCampana } from './estadoItemCampana.model';
export class ItemCampana {
    constructor(){
    }

    public id: number;
    public distrito: Distrito;
    public nombres: string;
    public apellidoPaterno: string;
    public apellidoMaterno: string;
    public direccion: string;
    public razonSocial: string;
    public correlativo: number;
    public enviable: boolean;    
    public correlativoBase: number;
    public idc: string;
    public estadoItemCampana: EstadoItemCampana;
    public detalle : string;
}