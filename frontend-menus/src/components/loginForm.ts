import { authService } from '../auth/authService';

export function renderLoginForm(container: HTMLElement) {
    container.innerHTML = `
        <div class="login-container">
            <h2>Gestión de Menús</h2>
            <form id="login-form">
                <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="email" style="font-size: 0.875rem; font-weight: 500;">Correo Electrónico</label>
                    <input type="email" id="email" placeholder="ejemplo@guardia.com" required>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="password" style="font-size: 0.875rem; font-weight: 500;">Contraseña</label>
                    <input type="password" id="password" placeholder="••••••••" required>
                </div>

                <p id="error-msg" style="display: none;"></p>
                
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    `;

    const form = document.getElementById('login-form') as HTMLFormElement;
    const errorMsg = document.getElementById('error-msg') as HTMLParagraphElement;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Deshabilitar botón para evitar múltiples clicks
        const submitBtn = form.querySelector('button')!;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Cargando...';

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const success = await authService.login(email, password);
            if (success) {
                window.location.reload(); 
            }
        } catch (err: any) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Iniciar Sesión';
            errorMsg.innerText = "Error: Credenciales no válidas";
            errorMsg.style.display = 'block';
        }
    });
}