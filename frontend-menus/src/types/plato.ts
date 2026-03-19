export interface Plato {
    id: number;
    nombre: string;
    tipo: 'primero' | 'segundo' | 'postre';
    menu: 'normal' | 'vegano' | 'bocadillo';
}

export interface PlatoResponse {
    success: boolean;
    data: Plato | Plato[];
    message?: string;
    errors?: any;
}