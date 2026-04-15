import api from './api';

export const solicitudService = {
    async enviarSolicitud(data: {
        fecha_para_la_comida: string;
        primero_id: number;
        segundo_id: number;
        postre_id: number;
    }) {
        const response = await api.post('/solicitudes', data);
        return response.data;
    },

    async getMisSolicitudes() {
        const response = await api.get('/mis-solicitudes');
        return response.data;
    },
    
    async actualizarSolicitud(id: number, data: any) {
    const response = await api.put(`/solicitudes/${id}`, data);
    return response.data;
},
async eliminarSolicitud(id: number) {
    const response = await api.delete(`/solicitudes/${id}`);
    return response.data;
},
async getAllPedidosHoy() {
    const response = await api.get('/admin/pedidos-hoy');
    return response.data;
}
};