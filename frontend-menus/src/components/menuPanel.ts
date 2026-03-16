import { platoService } from '../services/platoService';
import { menuService } from '../services/menuService';
import type { Plato } from '../types/plato';
import type { MenuDiario } from '../types/menu';

export async function renderMenuPanel(container: HTMLElement) {
    const hoy = new Date().toISOString().split('T')[0];

    container.innerHTML = `
        <div class="admin-container">
            <h1>Configuración del Menú Diario (${hoy})</h1>
            
            <div class="menu-manager-grid">
                <div class="card-panel">
                    <h3>1. Selecciona del Catálogo</h3>
                    <div id="catalog-list" class="mini-list">Cargando platos...</div>
                </div>

                <div class="card-panel">
                    <h3>2. Platos en el Menú de Hoy</h3>
                    <div id="today-menu-list" class="mini-list">Cargando menú...</div>
                </div>
            </div>
        </div>
    `;

    loadAllData(hoy);
}

async function loadAllData(fecha: string) {
    try {
        const [platos, menuHoy] = await Promise.all([
            platoService.getAll(),
            menuService.getMenuByFecha(fecha)
        ]);

        renderCatalog(platos, fecha);
        renderTodayMenu(menuHoy);
    } catch (error) {
        console.error("Error cargando datos del menú", error);
    }
}

function renderCatalog(platos: Plato[], fecha: string) {
    const container = document.getElementById('catalog-list')!;
    container.innerHTML = platos.map(p => `
        <div class="list-item">
            <span><strong>[${p.tipo}]</strong> ${p.nombre}</span>
            <button onclick="addToMenu(${p.id}, '${fecha}')" class="btn-add">Añadir ➔</button>
        </div>
    `).join('');
}

function renderTodayMenu(menu: MenuDiario[]) {
    const container = document.getElementById('today-menu-list')!;
    if (menu.length === 0) {
        container.innerHTML = '<p class="empty-msg">No hay platos seleccionados para hoy.</p>';
        return;
    }

    container.innerHTML = menu.map(m => `
        <div class="list-item active-item">
            <span><strong>[${m.plato?.tipo}]</strong> ${m.plato?.nombre}</span>
            <button onclick="removeFromMenu(${m.id})" class="btn-remove">Quitar ✖</button>
        </div>
    `).join('');
}

// Funciones globales para los botones
(window as any).addToMenu = async (plato_id: number, fecha: string) => {
    try {
        await menuService.addPlatoToMenu(plato_id, fecha);
        const hoy = new Date().toISOString().split('T')[0];
        loadAllData(hoy);
    } catch (e: any) {
        alert(e.response?.data?.message || "Error al añadir el plato");
    }
};

(window as any).removeFromMenu = async (id: number) => {
    await menuService.removePlatoFromMenu(id);
    const hoy = new Date().toISOString().split('T')[0];
    loadAllData(hoy);
};