import { platoService } from '../services/platoService';
import type { Plato } from '../types/plato';

export async function renderPlatosPanel(container: HTMLElement) {
    container.innerHTML = `
        <div class="admin-container">
            <div class="header-actions">
                <h1>Gestión de Platos</h1>
                <button id="btn-new-plato" class="btn-primary">+ Nuevo Plato</button>
            </div>
            
            <div id="plato-form-container" class="form-card" style="display: none;">
                <h3 id="plato-form-title">Crear Plato</h3>
                <form id="plato-form">
                    <input type="hidden" id="plato-id">
                    <input type="text" id="plato-nombre" placeholder="Nombre del plato" required>
                    <select id="plato-tipo" required>
                        <option value="Primero">Primero</option>
                        <option value="Segundo">Segundo</option>
                        <option value="Postre">Postre</option>
                    </select>
                    <div style="grid-column: span 2;">
                        <textarea id="plato-descripcion" placeholder="Descripción del plato (opcional)"></textarea>
                    </div>
                    <div class="form-btns">
                        <button type="submit" class="btn-save">Guardar</button>
                        <button type="button" id="btn-plato-cancel" class="btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>

            <table class="user-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="platos-list">
                    <tr><td colspan="4">Cargando platos...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    loadPlatos();

    const formContainer = document.getElementById('plato-form-container')!;
    const form = document.getElementById('plato-form') as HTMLFormElement;

    document.getElementById('btn-new-plato')?.addEventListener('click', () => {
        form.reset();
        (document.getElementById('plato-id') as HTMLInputElement).value = '';
        document.getElementById('plato-form-title')!.innerText = 'Crear Plato';
        formContainer.style.display = 'block';
    });

    document.getElementById('btn-plato-cancel')?.addEventListener('click', () => formContainer.style.display = 'none');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = (document.getElementById('plato-id') as HTMLInputElement).value;
        const platoData: Plato = {
            nombre: (document.getElementById('plato-nombre') as HTMLInputElement).value,
            tipo: (document.getElementById('plato-tipo') as HTMLSelectElement).value as any,
            descripcion: (document.getElementById('plato-descripcion') as HTMLTextAreaElement).value
        };

        if (id) {
            await platoService.update(Number(id), platoData);
        } else {
            await platoService.create(platoData);
        }
        formContainer.style.display = 'none';
        loadPlatos();
    });
}

async function loadPlatos() {
    const platos = await platoService.getAll();
    const tbody = document.getElementById('platos-list')!;
    tbody.innerHTML = platos.map(p => `
        <tr>
            <td><strong>${p.nombre}</strong></td>
            <td><span class="plato-badge">${p.tipo}</span></td>
            <td>${p.descripcion || '-'}</td>
            <td>
                <button onclick="editPlato(${p.id})" class="btn-edit">✏️</button>
                <button onclick="deletePlato(${p.id})" class="btn-delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Funciones globales para los botones de la tabla
(window as any).editPlato = async (id: number) => {
    const platos = await platoService.getAll();
    const plato = platos.find(p => p.id === id);
    if (plato) {
        (document.getElementById('plato-id') as HTMLInputElement).value = String(plato.id);
        (document.getElementById('plato-nombre') as HTMLInputElement).value = plato.nombre;
        (document.getElementById('plato-tipo') as HTMLSelectElement).value = plato.tipo;
        (document.getElementById('plato-descripcion') as HTMLTextAreaElement).value = plato.descripcion || '';
        document.getElementById('plato-form-title')!.innerText = 'Editar Plato';
        document.getElementById('plato-form-container')!.style.display = 'block';
    }
};

(window as any).deletePlato = async (id: number) => {
    if (confirm('¿Seguro que quieres eliminar este plato?')) {
        await platoService.delete(id);
        loadPlatos();
    }
};