import { authService } from '../auth/authService';

export function renderNavbar(container: HTMLElement, onNavigate: (page: string) => void) {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="nav-content">
            <div class="nav-left">
                <span class="logo">Gestión Menús</span>
                <div class="nav-links">
                    <a href="#" id="link-home">Inicio</a>
                    ${userInfo.isAdmin ? '<a href="#" id="link-admin">Panel Administrador</a>' : ''}
                </div>
            </div>
            <div class="user-menu">
                <span>Hola, <strong>${userInfo.name}</strong></span>
                <button id="logout-btn" class="btn-logout">Cerrar Sesión</button>
            </div>
        </div>
    `;

    container.prepend(nav);

    // Eventos de navegación
    document.getElementById('link-home')?.addEventListener('click', (e) => {
        e.preventDefault();
        onNavigate('home');
    });

    document.getElementById('link-admin')?.addEventListener('click', (e) => {
        e.preventDefault();
        onNavigate('admin');
    });

    document.getElementById('logout-btn')?.addEventListener('click', () => {
        authService.logout();
    });
}