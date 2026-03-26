import { solicitudService } from '../services/solicitudService';

export async function renderMisPedidos(container: HTMLElement) {
    container.innerHTML = `
        <div class="pedido-container" style="max-width: 800px;">
            <div class="pedido-header">
                <h2>Mis Pedidos</h2>
                <p>Historial de menús solicitados</p>
            </div>
            <div id="lista-pedidos">Cargando tus pedidos...</div>
            <button id="btn-volver-home" class="btn-secondary" style="margin-top: 20px;">Volver al Inicio</button>
        </div>
    `;

    const listaDiv = document.getElementById('lista-pedidos')!;

    try {
        const pedidos = await solicitudService.getMisSolicitudes();

        if (pedidos.length === 0) {
            listaDiv.innerHTML = '<p>Aún no has realizado ningún pedido.</p>';
        } else {
            listaDiv.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Primero</th>
                            <th>Segundo</th>
                            <th>Postre</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedidos.map((p: any) => `
                            <tr>
                                <td>${new Date(p.fecha_para_la_comida).toLocaleDateString()}</td>
                                <td>${p.primero?.nombre || 'N/A'}</td>
                                <td>${p.segundo?.nombre || 'N/A'}</td>
                                <td>${p.postre?.nombre || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        listaDiv.innerHTML = '<p style="color: red;">Error al cargar los pedidos.</p>';
    }

    document.getElementById('btn-volver-home')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    });
}