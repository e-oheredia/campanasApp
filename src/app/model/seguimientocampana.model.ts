import { EstadoCampana } from "./estadocampana.model";
import { Empleado } from "./empleado.model";

export class SeguimientoCampana {
    constructor(public id: number, public observacion: string, public fecha: Date, public estadoCampana: EstadoCampana, public empleado: Empleado){}
}