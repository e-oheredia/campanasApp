import { TipoPlazo } from "./tipoplazo.model";

export class Plazo {
    constructor(public id: number, public nombre:string, public tipoPlazo: TipoPlazo, public tiempoEnvio: number){}
}