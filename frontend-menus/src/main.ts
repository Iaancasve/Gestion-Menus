import './style.css'
import { authService } from './auth/authService';
import { renderLoginForm } from './components/loginForm';
import { renderNavbar } from './components/navbar';
import { renderAdminPanel } from './components/adminPanel';
import { renderPlatosPanel } from './components/platosPanel';
import { renderMenuPanel } from './components/menuPanel';
import { renderPedidoMenu } from './components/pedidoMenu';
import { renderMisPedidos } from './components/misPedidos'; 
import { renderEditarPedido } from './components/editarPedido';

const appDiv = document.querySelector<HTMLDivElement>('#app')!;

function init() {
    appDiv.innerHTML = ''; 

    if (!authService.isAuthenticated()) {
        renderLoginForm(appDiv);
    } else {
        // Renderizar Navbar una sola vez
        renderNavbar(appDiv, (page) => navigateTo(page));

        const mainContent = document.createElement('main');
        mainContent.id = 'main-view';
        mainContent.className = 'container';
        appDiv.appendChild(mainContent);

        navigateTo('home');
    }
}

function navigateTo(page: string) {
    const mainView = document.getElementById('main-view')!;
    mainView.innerHTML = ''; 

    if (page === 'home') {
        mainView.innerHTML = `
            <div class="welcome-card">
                <h1>Bienvenido al Sistema de Menús</h1>
                <p>Utiliza el menú superior o las opciones de abajo para comenzar.</p>
                <div class="home-options" style="display: flex; gap: 10px; margin-top: 20px; justify-content: center;">
                    <button id="btn-ir-pedido" class="btn-primary">Pedir Menú</button>
                    <button id="btn-ver-pedidos" class="btn-secondary">Ver mis Pedidos</button>
                </div>
            </div>
        `;
        
        // Listeners para los botones de la home
        document.getElementById('btn-ir-pedido')?.addEventListener('click', () => navigateTo('pedir'));
        document.getElementById('btn-ver-pedidos')?.addEventListener('click', () => navigateTo('mis-pedidos'));

    } else if (page === 'pedir') {
        renderPedidoMenu(mainView);
    } else if (page === 'mis-pedidos') {
        renderMisPedidos(mainView);
    } else if (page === 'admin') {
        renderAdminPanel(mainView);
    } else if (page === 'platos') {
        renderPlatosPanel(mainView); 
    } else if (page === 'menu') {
        renderMenuPanel(mainView);
    }
}

window.addEventListener('navigate', (e: any) => {
    navigateTo(e.detail);
});

window.addEventListener('edit-pedido', (e: any) => {
    const mainView = document.getElementById('main-view')!;
    renderEditarPedido(mainView, e.detail); 
});

init();