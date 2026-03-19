import { platoService } from '../services/platoService';
import { solicitudService } from '../services/solicitudService';
import type { Plato } from '../types/plato';

export async function renderPedidoMenu(container: HTMLElement) {
    container.innerHTML = `
        <div class="pedido-container">
            <h2>Pedir Menú</h2>
            <div id="paso-1">
                <label>Fecha (Lunes a Domingo de esta semana):</label>
                <input type="date" id="fecha-comida" class="form-input">
                
                <label>Tipo de Menú:</label>
                <select id="tipo-menu" class="form-input">
                    <option value="normal">Normal</option>
                    <option value="vegano">Vegano</option>
                    <option value="bocadillo">Bocadillo</option>
                </select>
                <button id="btn-continuar" class="btn-primary">Continuar</button>
            </div>
            <div id="paso-2" style="display:none;">
                <div id="seleccion-platos"></div>
                <button id="btn-enviar" class="btn-primary">Enviar Pedido</button>
            </div>
        </div>
    `;

    const fechaInput = document.getElementById('fecha-comida') as HTMLInputElement;
    const btnContinuar = document.getElementById('btn-continuar');
    const paso1 = document.getElementById('paso-1')!;
    const paso2 = document.getElementById('paso-2')!;
    
    // Configurar límites de fecha (solo semana actual, no días pasados)
    const hoy = new Date();
    const minFecha = hoy.toISOString().split('T')[0];
    fechaInput.min = minFecha;

    btnContinuar?.addEventListener('click', async () => {
        const fecha = fechaInput.value;
        const tipoMenu = (document.getElementById('tipo-menu') as HTMLSelectElement).value;

        if (!fecha) return alert('Selecciona una fecha');

        // Obtener platos según el tipo de menú seleccionado
        const todosLosPlatos: Plato[] = await platoService.getAll();
        const platosFiltrados = todosLosPlatos.filter(p => p.menu === tipoMenu);

        renderSeleccionPlatos(platosFiltrados);
        paso1.style.display = 'none';
        paso2.style.display = 'block';
    });

    function renderSeleccionPlatos(platos: Plato[]) {
        const div = document.getElementById('seleccion-platos')!;
        const tipos = ['primero', 'segundo', 'postre'];
        
        div.innerHTML = tipos.map(tipo => `
            <h3>Selecciona un ${tipo}</h3>
            ${platos.filter(p => p.tipo === tipo).slice(0, 3).map(p => `
                <label>
                    <input type="radio" name="${tipo}" value="${p.id}" required> ${p.nombre}
                </label>
            `).join('<br>')}
        `).join('');
    }

    document.getElementById('btn-enviar')?.addEventListener('click', async () => {
        const primero = document.querySelector<HTMLInputElement>('input[name="primero"]:checked')?.value;
        const segundo = document.querySelector<HTMLInputElement>('input[name="segundo"]:checked')?.value;
        const postre = document.querySelector<HTMLInputElement>('input[name="postre"]:checked')?.value;

        if (!primero || !segundo || !postre) return alert('Debes elegir un plato de cada tipo');

        try {
            await solicitudService.enviarSolicitud({
                fecha_para_la_comida: fechaInput.value,
                primero_id: Number(primero),
                segundo_id: Number(segundo),
                postre_id: Number(postre)
            });
            alert('Pedido realizado con éxito');
            location.reload();
        } catch (error) {
            alert('Error al guardar el pedido');
        }
    });
}