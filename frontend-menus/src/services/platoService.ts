import api from './api';
import type { Plato, PlatoResponse } from '../types/plato';

export const platoService = {
    // Obtener todos los platos
    async getAll(): Promise<Plato[]> {
        const { data } = await api.get<PlatoResponse>('/platos');
        return data.data as Plato[];
    },

    // Crear un nuevo plato
    async create(plato: Plato): Promise<PlatoResponse> {
        const { data } = await api.post<PlatoResponse>('/platos', plato);
        return data;
    },

    // Actualizar un plato existente
    async update(id: number, plato: Plato): Promise<PlatoResponse> {
        const { data } = await api.put<PlatoResponse>(`/platos/${id}`, plato);
        return data;
    },

    // Eliminar un plato
    async delete(id: number): Promise<PlatoResponse> {
        const { data } = await api.delete<PlatoResponse>(`/platos/${id}`);
        return data;
    }
};