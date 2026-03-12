export interface Plato {
    id?: number;
    nombre: string;
    tipo: 'Primero' | 'Segundo' | 'Postre';
    descripcion?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PlatoResponse {
    success: boolean;
    data: Plato | Plato[];
    message?: string;
    errors?: any;
}