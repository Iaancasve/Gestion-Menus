import { platoService } from '../services/platoService';
import { solicitudService } from '../services/solicitudService';
import type { Plato } from '../types/plato';

export async function renderPedidoMenu(container: HTMLElement) {
    // 1. Lógica de Restricción de Fechas (Esta semana, desde hoy hasta el domingo)
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 (domingo) a 6 (sábado)
    
    // Calculamos el lunes de la semana actual
    const lunes = new Date(hoy);
    const diferenciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    lunes.setDate(hoy.getDate() + diferenciaLunes);
    
    // Calculamos el domingo de la semana actual
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    // Formateamos para los atributos min y max del input date (YYYY-MM-DD)
    const minFecha = hoy.toISOString().split('T')[0];
    const maxFecha = domingo.toISOString().split('T')[0];

    container.innerHTML = `
        <div class="pedido-container">
            <div class="pedido-header">
                <h2>Nuevo Pedido</h2>
                <p>Gestiona tu comida para esta semana</p>
            </div>
            
            <div id="paso-1">
                <div class="form-group">
                    <label for="fecha-comida">Selecciona el día:</label>
                    <input type="date" id="fecha-comida" class="form-input" 
                           min="${minFecha}" max="${maxFecha}" value="${minFecha}">
                    <small style="color: #666; display: block; margin-top: 5px;">
                        * Solo se permiten pedidos para la semana en curso.
                    </small>
                </div>
                
                <div class="form-group">
                    <label for="tipo-menu">Tipo de menú:</label>
                    <select id="tipo-menu" class="form-input">
                        <option value="normal">🍴 Menú Normal</option>
                        <option value="vegano">🌿 Menú Vegano</option>
                        <option value="bocadillo">🥪 Bocadillo</option>
                    </select>
                </div>
                
                <button id="btn-continuar" class="btn-primary" style="width: 100%; margin-top: 10px;">
                    Continuar a selección de platos
                </button>
            </div>

            <div id="paso-2" style="display:none;">
                <div id="seleccion-platos"></div>
                <div style="display: flex; gap: 10px; margin-top: 25px;">
                    <button id="btn-volver" class="btn-secondary" style="flex: 1;">Atrás</button>
                    <button id="btn-enviar" class="btn-primary" style="flex: 2;">Confirmar y Guardar</button>
                </div>
            </div>
        </div>
    `;

    // Selectores de elementos
    const fechaInput = document.getElementById('fecha-comida') as HTMLInputElement;
    const tipoMenuSelect = document.getElementById('tipo-menu') as HTMLSelectElement;
    const btnContinuar = document.getElementById('btn-continuar');
    const btnVolver = document.getElementById('btn-volver');
    const btnEnviar = document.getElementById('btn-enviar');
    const paso1 = document.getElementById('paso-1')!;
    const paso2 = document.getElementById('paso-2')!;

    // Evento para pasar al paso 2
    btnContinuar?.addEventListener('click', async () => {
        if (!fechaInput.value) return alert('Por favor, selecciona una fecha válida.');

        try {
            // Mostrar un indicador de carga simple
            btnContinuar.innerText = 'Cargando platos...';
            btnContinuar.setAttribute('disabled', 'true');

            const platos: Plato[] = await platoService.getAll();
            const tipoSeleccionado = tipoMenuSelect.value;

            // Filtrar platos por el tipo de menú (normal, vegano, bocadillo)
            const platosFiltrados = platos.filter(p => p.menu === tipoSeleccionado);

            if (platosFiltrados.length === 0) {
                alert('No hay platos registrados para esta categoría de menú.');
                btnContinuar.innerText = 'Continuar a selección de platos';
                btnContinuar.removeAttribute('disabled');
                return;
            }

            renderSeleccionPlatos(platosFiltrados);
            paso1.style.display = 'none';
            paso2.style.display = 'block';
        } catch (error) {
            console.error(error);
            alert('Error al obtener los platos del servidor.');
        } finally {
            btnContinuar.innerText = 'Continuar a selección de platos';
            btnContinuar.removeAttribute('disabled');
        }
    });

    // Función para renderizar los platos con el nuevo diseño
    function renderSeleccionPlatos(platos: Plato[]) {
        const div = document.getElementById('seleccion-platos')!;
        const categorias: ('primero' | 'segundo' | 'postre')[] = ['primero', 'segundo', 'postre'];
        
        div.innerHTML = categorias.map(cat => {
            const platosDeCategoria = platos.filter(p => p.tipo === cat).slice(0, 3);
            return `
                <div class="categoria-grupo">
                    <h3>Selecciona un ${cat}</h3>
                    ${platosDeCategoria.length > 0 ? platosDeCategoria.map(p => `
                        <div class="opcion-plato">
                            <input type="radio" name="${cat}" id="plato-${p.id}" value="${p.id}">
                            <label for="plato-${p.id}">${p.nombre}</label>
                        </div>
                    `).join('') : '<p>No hay platos disponibles.</p>'}
                </div>
            `;
        }).join('');
    }

    // Evento para volver al paso 1
    btnVolver?.addEventListener('click', () => {
        paso2.style.display = 'none';
        paso1.style.display = 'block';
    });

    // Evento final para guardar en la base de datos
    btnEnviar?.addEventListener('click', async () => {
        const primeroId = document.querySelector<HTMLInputElement>('input[name="primero"]:checked')?.value;
        const segundoId = document.querySelector<HTMLInputElement>('input[name="segundo"]:checked')?.value;
        const postreId = document.querySelector<HTMLInputElement>('input[name="postre"]:checked')?.value;

        if (!primeroId || !segundoId || !postreId) {
            return alert('Debes seleccionar un plato de cada categoría para completar el pedido.');
        }

        try {
            await solicitudService.enviarSolicitud({
                fecha_para_la_comida: fechaInput.value,
                primero_id: Number(primeroId),
                segundo_id: Number(segundoId),
                postre_id: Number(postreId)
            });

            alert('✅ ¡Pedido realizado con éxito!');
            // Redirigir a inicio tras el éxito
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
            // Si no tienes el evento global configurado, puedes usar: location.reload();
        } catch (error) {
            alert('Hubo un error al guardar tu pedido. Inténtalo de nuevo.');
        }
    });
}