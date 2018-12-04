import { TipoHabilitado } from "./tipohabilitado.model";

export class PaqueteHabilitado {
    constructor(public id: number, public descripcion:string, public tiposHabilitado: TipoHabilitado[]){}
}