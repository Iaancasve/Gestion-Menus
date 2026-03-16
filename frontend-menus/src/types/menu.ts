import type { Plato } from './plato';

export interface MenuDiario {
    id?: number;
    plato_id: number;
    fecha: string;
    plato?: Plato; 
}

export interface MenuResponse {
    success: boolean;
    data: MenuDiario[];
    message?: string;
}