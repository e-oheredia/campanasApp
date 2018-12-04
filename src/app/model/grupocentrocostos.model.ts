import { CentroCostos } from './centrocostos.model';
import { Auspiciador } from './auspiciador.model';
export class GrupoCentroCostos extends Auspiciador {
    constructor(public centroscostos: CentroCostos[]){
        super();
    }
}