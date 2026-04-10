import { platoService } from '../services/platoService';
import { solicitudService } from '../services/solicitudService';
import type { Plato } from '../types/plato';

export async function renderEditarPedido(container: HTMLElement, pedido: any) {
    container.innerHTML = `
        <div class="pedido-container">
            <div class="pedido-header">
                <h2>Editar Mi Pedido</h2>
                <p>Modificando pedido del día: <strong>${new Date(pedido.fecha_para_la_comida).toLocaleDateString()}</strong></p>
            </div>
            <div id="seleccion-platos-edit">Cargando platos disponibles...</div>
            <div style="display: flex; gap: 10px; margin-top: 25px;">
                <button id="btn-cancelar-edit" class="btn-secondary" style="flex: 1;">Cancelar</button>
                <button id="btn-guardar-edit" class="btn-primary" style="flex: 2;">Guardar Cambios</button>
            </div>
        </div>
    `;

    const listaDiv = document.getElementById('seleccion-platos-edit')!;

    try {
        const todosLosPlatos: Plato[] = await platoService.getAll();
        const tipoMenuOriginal = pedido.primero.menu; 
        const platosFiltrados = todosLosPlatos.filter(p => p.menu === tipoMenuOriginal);

        renderFormulario(platosFiltrados, pedido);
    } catch (error) {
        listaDiv.innerHTML = '<p style="color:red;">Error al cargar los platos para editar.</p>';
    }

    function renderFormulario(platos: Plato[], actual: any) {
        const categorias: ('primero' | 'segundo' | 'postre')[] = ['primero', 'segundo', 'postre'];
        
        listaDiv.innerHTML = categorias.map(cat => `
            <div class="categoria-grupo">
                <h3>Selecciona tu ${cat}</h3>
                ${platos.filter(p => p.tipo === cat).map(p => `
                    <div class="opcion-plato">
                        <input type="radio" name="${cat}" id="edit-${p.id}" value="${p.id}" 
                               ${p.id === actual[`${cat}_id`] ? 'checked' : ''}>
                        <label for="edit-${p.id}">${p.nombre}</label>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    // EVENTO CANCELAR: Vuelve a la lista de pedidos
    document.getElementById('btn-cancelar-edit')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'mis-pedidos' }));
    });

    // EVENTO GUARDAR: Envía el PUT al servidor
    document.getElementById('btn-guardar-edit')?.addEventListener('click', async () => {
        const data = {
            primero_id: Number(document.querySelector<HTMLInputElement>('input[name="primero"]:checked')?.value),
            segundo_id: Number(document.querySelector<HTMLInputElement>('input[name="segundo"]:checked')?.value),
            postre_id: Number(document.querySelector<HTMLInputElement>('input[name="postre"]:checked')?.value),
        };

        if (!data.primero_id || !data.segundo_id || !data.postre_id) {
            return alert('Debes seleccionar los 3 platos.');
        }

        try {
            await solicitudService.actualizarSolicitud(pedido.id, data);
            alert('✅ Pedido actualizado correctamente');
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'mis-pedidos' }));
        } catch (error) {
            alert('Error al actualizar el pedido');
        }
    });
}