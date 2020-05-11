import { Imprimivel } from '../models/index';

export function LOG (...objects: Imprimivel[]) {
    
    objects.forEach( object => object.toText());
}
