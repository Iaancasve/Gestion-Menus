export interface User {
    id: number;
    name: string;
    email: string;
    es_admin: boolean;
    servicio_id: number;
}

export interface LoginResponse {
    success: boolean;
    data: {
        token: string;
        token_type: string;
        name: string;
        es_admin: boolean;
    };
    message: string;
}