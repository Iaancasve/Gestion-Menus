import api from './api';
import type { User } from '../types/auth';

export const userService = {
    async getAll() {
        const { data } = await api.get<{success: boolean, data: User[]}>('/usuarios');
        return data.data;
    },

    async create(userData: Partial<User> & {password: string}) {
        const { data } = await api.post('/usuarios', userData);
        return data;
    },

    async update(id: number, userData: Partial<User>) {
        const { data } = await api.put(`/usuarios/${id}`, userData);
        return data;
    },

    async delete(id: number) {
        const { data } = await api.delete(`/usuarios/${id}`);
        return data;
    }
};