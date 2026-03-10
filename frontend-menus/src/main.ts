import './style.css'
import { authService } from './auth/authService';
import { renderLoginForm } from './components/loginForm';

const appDiv = document.querySelector<HTMLDivElement>('#app')!;

function init() {
    if (!authService.isAuthenticated()) {
        renderLoginForm(appDiv);
    } else {
        const user = JSON.parse(localStorage.getItem('user_info') || '{}');
        appDiv.innerHTML = `
            <h1>Hola, ${user.name}</h1>
            <p>${user.isAdmin ? 'Eres Administrador' : 'Eres Guardia'}</p>
            <button id="logout-btn">Cerrar Sesión</button>
        `;
        
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            authService.logout();
        });
    }
}

init();