import { EstadoCampana } from "./estadocampana.model";

export class SeguimientoCampana {
    constructor(public id: number, public observacion: string, public fecha: Date, public estadoCampana: EstadoCampana){}
}