export function renderAdminPanel(container: HTMLElement) {
    container.innerHTML = `
        <div class="admin-dashboard">
            <h1>Panel de Administración</h1>
            <div class="actions">
                <button class="btn-primary" id="btn-list-users">Listar Usuarios</button>
                <button class="btn-primary" id="btn-create-user">Nuevo Usuario</button>
            </div>
            <div id="admin-content" class="mt-4">
                <p>Selecciona una opción para empezar a gestionar.</p>
            </div>
        </div>
    `;
}