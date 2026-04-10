import { solicitudService } from '../services/solicitudService';

export async function renderMisPedidos(container: HTMLElement) {
    container.innerHTML = `
        <div class="pedido-container" style="max-width: 900px;">
            <div class="pedido-header">
                <h2>Mis Pedidos</h2>
                <p>Historial y gestión de tus menús</p>
            </div>
            <div id="lista-pedidos" class="table-responsive">Cargando...</div>
            <button id="btn-volver-home" class="btn-secondary" style="margin-top: 20px;">Volver</button>
        </div>
    `;

    const listaDiv = document.getElementById('lista-pedidos')!;

    try {
        const pedidos = await solicitudService.getMisSolicitudes();

        if (pedidos.length === 0) {
            listaDiv.innerHTML = '<p>No tienes pedidos registrados.</p>';
        } else {
            listaDiv.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Menú</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedidos.map((p: any) => `
                            <tr>
                                <td>${new Date(p.fecha_para_la_comida).toLocaleDateString()}</td>
                                <td>${p.primero?.nombre}, ${p.segundo?.nombre}...</td>
                                <td style="text-align: center; display: flex; gap: 5px; justify-content: center;">
                                    <button class="btn-edit" data-id="${p.id}">✏️ Editar</button>
                                    <button class="btn-delete" data-id="${p.id}" style="background-color: #fff5f5; color: #c53030; border: 1px solid #feb2b2;">🗑️ Cancelar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            // Lógica para EDITAR
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = (e.currentTarget as HTMLElement).dataset.id;
                    const pedido = pedidos.find((p: any) => p.id == id);
                    if (pedido) window.dispatchEvent(new CustomEvent('edit-pedido', { detail: pedido }));
                });
            });

            // Lógica para ELIMINAR (Cancelar)
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = (e.currentTarget as HTMLElement).dataset.id;
                    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
                        try {
                            await solicitudService.eliminarSolicitud(Number(id));
                            alert('Pedido cancelado');
                            renderMisPedidos(container); // Recargamos la vista
                        } catch (error) {
                            alert('No se pudo cancelar el pedido');
                        }
                    }
                });
            });
        }
    } catch (error) {
        listaDiv.innerHTML = '<p>Error al cargar pedidos.</p>';
    }

    document.getElementById('btn-volver-home')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    });
}