import api from '../services/api';
import type { LoginResponse } from '../types/auth';

export const authService = {
    async login(email: string, password: string): Promise<boolean> {
        try {
            const { data } = await api.post<LoginResponse>('/login', { email, password });
            
            if (data.success) {
                localStorage.setItem('auth_token', data.data.token);
                localStorage.setItem('user_info', JSON.stringify({
                    name: data.data.name,
                    isAdmin: data.data.es_admin
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    },

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        window.location.reload();
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }
};