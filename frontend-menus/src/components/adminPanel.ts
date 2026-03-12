import { userService } from '../services/userService';

export async function renderAdminPanel(container: HTMLElement) {
    container.innerHTML = `
        <div class="admin-container">
            <div class="header-actions">
                <h1>Gestión de Usuarios</h1>
                <button id="btn-new-user" class="btn-primary">+ Nuevo Usuario</button>
            </div>
            
            <div id="user-form-container" class="form-card" style="display: none;">
                <h3 id="form-title">Crear Usuario</h3>
                <form id="user-form">
                    <input type="hidden" id="user-id">
                    <input type="text" id="name" placeholder="Nombre completo" required>
                    <input type="email" id="email" placeholder="Correo electrónico" required>
                    <input type="password" id="password" placeholder="Contraseña (dejar vacío para no cambiar)">
                    <select id="servicio_id" required>
                        <option value="1">Servicio 1</option>
                        <option value="2">Servicio 2</option>
                    </select>
                    <label><input type="checkbox" id="es_admin"> Es Administrador</label>
                    <div class="form-btns">
                        <button type="submit" class="btn-save">Guardar</button>
                        <button type="button" id="btn-cancel" class="btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>

            <table class="user-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="user-list"></tbody>
            </table>
        </div>
    `;

    loadUsers();

    // --- Lógica de Eventos ---
    const formContainer = document.getElementById('user-form-container')!;
    const form = document.getElementById('user-form') as HTMLFormElement;

    document.getElementById('btn-new-user')?.addEventListener('click', () => {
        form.reset();
        (document.getElementById('user-id') as HTMLInputElement).value = '';
        document.getElementById('form-title')!.innerText = 'Crear Usuario';
        formContainer.style.display = 'block';
    });

    document.getElementById('btn-cancel')?.addEventListener('click', () => formContainer.style.display = 'none');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = (document.getElementById('user-id') as HTMLInputElement).value;
        const userData: any = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            servicio_id: Number((document.getElementById('servicio_id') as HTMLSelectElement).value),
            es_admin: (document.getElementById('es_admin') as HTMLInputElement).checked
        };

        const password = (document.getElementById('password') as HTMLInputElement).value;
        if (password) userData.password = password;

        if (id) {
            await userService.update(Number(id), userData);
        } else {
            await userService.create(userData);
        }
        formContainer.style.display = 'none';
        loadUsers();
    });
}

async function loadUsers() {
    const users = await userService.getAll();
    const tbody = document.getElementById('user-list')!;
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.es_admin ? '✅' : '❌'}</td>
            <td>
                <button onclick="editUser(${user.id})" class="btn-edit">✏️</button>
                <button onclick="deleteUser(${user.id})" class="btn-delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Hacemos las funciones globales para que el HTML string las vea
(window as any).editUser = async (id: number) => {
    const users = await userService.getAll();
    const user = users.find(u => u.id === id);
    if (user) {
        (document.getElementById('user-id') as HTMLInputElement).value = String(user.id);
        (document.getElementById('name') as HTMLInputElement).value = user.name;
        (document.getElementById('email') as HTMLInputElement).value = user.email;
        (document.getElementById('es_admin') as HTMLInputElement).checked = user.es_admin;
        document.getElementById('form-title')!.innerText = 'Editar Usuario';
        document.getElementById('user-form-container')!.style.display = 'block';
    }
};

(window as any).deleteUser = async (id: number) => {
    if (confirm('¿Seguro que quieres borrar este usuario?')) {
        await userService.delete(id);
        const event = new CustomEvent('refreshUsers');
        window.dispatchEvent(event);
        location.reload(); // Recarga simple para actualizar la lista
    }
};