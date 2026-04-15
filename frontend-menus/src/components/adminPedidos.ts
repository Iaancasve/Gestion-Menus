import { solicitudService } from '../services/solicitudService';

export async function renderAdminPedidos(container: HTMLElement) {
    container.innerHTML = `
        <div class="admin-container">
            <h2>Pedidos Realizados Hoy</h2>
            <div id="pedidos-list">Cargando pedidos...</div>
        </div>
    `;
    
    const listDiv = document.getElementById('pedidos-list')!;
    
    try {
        const pedidos = await solicitudService.getAllPedidosHoy();
        
        if (!pedidos || pedidos.length === 0) {
            listDiv.innerHTML = '<p class="no-data">No se han realizado pedidos el día de hoy.</p>';
            return;
        }

        listDiv.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Primero</th>
                        <th>Segundo</th>
                        <th>Postre</th>
                        <th>Fecha Pedido</th>
                    </tr>
                </thead>
                <tbody>
                    ${pedidos.map((p: any) => `
                        <tr>
                            <td><strong>${p.user?.name || 'N/A'}</strong></td>
                            <td>${p.primero?.nombre || '-'}</td>
                            <td>${p.segundo?.nombre || '-'}</td>
                            <td>${p.postre?.nombre || '-'}</td>
                            <td>${new Date(p.created_at).toLocaleTimeString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        listDiv.innerHTML = '<p class="error">Error al conectar con el servidor. Verifica que el backend esté activo.</p>';
    }
}