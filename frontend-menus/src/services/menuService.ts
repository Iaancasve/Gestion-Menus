import api from './api';
import type { MenuDiario, MenuResponse } from '../types/menu';

export const menuService = {
    // Obtener los platos del menú de una fecha concreta
    async getMenuByFecha(fecha: string): Promise<MenuDiario[]> {
        const { data } = await api.get<MenuResponse>(`/menu-hoy?fecha=${fecha}`);
        return data.data;
    },

    // Añadir un plato al menú de una fecha
    async addPlatoToMenu(plato_id: number, fecha: string): Promise<any> {
        const { data } = await api.post('/menu-hoy', { plato_id, fecha });
        return data;
    },

    // Quitar un plato del menú
    async removePlatoFromMenu(id: number): Promise<any> {
        const { data } = await api.delete(`/menu-hoy/${id}`);
        return data;
    }
};