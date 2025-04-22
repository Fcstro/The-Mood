import { Header } from './header.js';
import { Footer } from './footer.js';

export function renderLoginPage() {
    const container = document.getElementById('app');
    container.innerHTML = ''; // Clear the container

    const header = Header({
        onLoginClick: () => renderLoginPage(),
        onSignupClick: () => import('./signup.js').then(module => module.renderSignupPage())
    });

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    formContainer.innerHTML = `
        <h4 class="text-center mb-4">LOG IN</h4>
        <form id="login-form">
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="username" placeholder="Username" required>
                <label for="username">Username</label>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" id="password" placeholder="Password" required>
                <label for="password">Password</label>
            </div>
            <button type="submit" class="btn btn-primary">LOG IN</button>
        </form>
    `;

    formContainer.querySelector('#login-form').onsubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
    };

    container.appendChild(header);
    container.appendChild(formContainer);
    container.appendChild(Footer());
}