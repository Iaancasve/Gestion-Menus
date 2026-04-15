import { platoService } from '../services/platoService';
import { solicitudService } from '../services/solicitudService';
import type { Plato } from '../types/plato';

export async function renderPedidoMenu(container: HTMLElement) {
    // --- RESTRICCIÓN HORARIA (11:00 AM) ---
    const ahora = new Date();
    const horaActual = ahora.getHours();

    if (horaActual >= 11) {
        container.innerHTML = `
            <div class="pedido-container" style="border-top: 5px solid #e74c3c; text-align: center;">
                <h2 style="color: #e74c3c;">⚠️ Plazo Finalizado</h2>
                <p>Lo sentimos, el horario para realizar pedidos termina a las <strong>11:00 AM</strong>.</p>
                <p style="margin-bottom: 20px;">Por favor, vuelve mañana antes de la hora límite.</p>
                <button id="btn-volver-home" class="btn-secondary">Volver al Inicio</button>
            </div>
        `;
        document.getElementById('btn-volver-home')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
        });
        return; // Detenemos la ejecución
    }

    // --- LÓGICA DE FECHAS ---
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const lunes = new Date(hoy);
    const diferenciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    lunes.setDate(hoy.getDate() + diferenciaLunes);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

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

    // (Selectores y Eventos se mantienen igual que tu código original...)
    const fechaInput = document.getElementById('fecha-comida') as HTMLInputElement;
    const tipoMenuSelect = document.getElementById('tipo-menu') as HTMLSelectElement;
    const btnContinuar = document.getElementById('btn-continuar');
    const btnVolver = document.getElementById('btn-volver');
    const btnEnviar = document.getElementById('btn-enviar');
    const paso1 = document.getElementById('paso-1')!;
    const paso2 = document.getElementById('paso-2')!;

    btnContinuar?.addEventListener('click', async () => {
        if (!fechaInput.value) return alert('Por favor, selecciona una fecha válida.');
        try {
            btnContinuar.innerText = 'Cargando platos...';
            btnContinuar.setAttribute('disabled', 'true');
            const platos: Plato[] = await platoService.getAll();
            const tipoSeleccionado = tipoMenuSelect.value;
            const platosFiltrados = platos.filter(p => p.menu === tipoSeleccionado);

            if (platosFiltrados.length === 0) {
                alert('No hay platos registrados para esta categoría.');
                return;
            }
            renderSeleccionPlatos(platosFiltrados);
            paso1.style.display = 'none';
            paso2.style.display = 'block';
        } catch (error) {
            alert('Error al conectar con el servidor.');
        } finally {
            btnContinuar.innerText = 'Continuar a selección de platos';
            btnContinuar.removeAttribute('disabled');
        }
    });

    function renderSeleccionPlatos(platos: Plato[]) {
        const div = document.getElementById('seleccion-platos')!;
        const categorias: ('primero' | 'segundo' | 'postre')[] = ['primero', 'segundo', 'postre'];
        div.innerHTML = categorias.map(cat => {
            const platosDeCategoria = platos.filter(p => p.tipo === cat).slice(0, 3);
            return `
                <div class="categoria-grupo">
                    <h3>Selecciona un ${cat}</h3>
                    ${platosDeCategoria.map(p => `
                        <div class="opcion-plato">
                            <input type="radio" name="${cat}" id="plato-${p.id}" value="${p.id}">
                            <label for="plato-${p.id}">${p.nombre}</label>
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('');
    }

    btnVolver?.addEventListener('click', () => {
        paso2.style.display = 'none';
        paso1.style.display = 'block';
    });

    btnEnviar?.addEventListener('click', async () => {
        const primeroId = document.querySelector<HTMLInputElement>('input[name="primero"]:checked')?.value;
        const segundoId = document.querySelector<HTMLInputElement>('input[name="segundo"]:checked')?.value;
        const postreId = document.querySelector<HTMLInputElement>('input[name="postre"]:checked')?.value;

        if (!primeroId || !segundoId || !postreId) return alert('Selecciona un plato de cada categoría.');

        try {
            await solicitudService.enviarSolicitud({
                fecha_para_la_comida: fechaInput.value,
                primero_id: Number(primeroId),
                segundo_id: Number(segundoId),
                postre_id: Number(postreId)
            });
            alert('✅ ¡Pedido realizado con éxito!');
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
        } catch (error) {
            alert('Error al guardar el pedido. ¿Quizás ya pasaron las 11:00 AM?');
        }
    });
}