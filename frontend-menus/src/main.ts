import './style.css'
import { authService } from './auth/authService';
import { renderLoginForm } from './components/loginForm';
import { renderNavbar } from './components/navBar';
import { renderAdminPanel } from './components/adminPanel';

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
                <p>Utiliza el menú superior para navegar por las opciones disponibles.</p>
            </div>
        `;
    } else if (page === 'admin') {
        renderAdminPanel(mainView);
    }
}

init();