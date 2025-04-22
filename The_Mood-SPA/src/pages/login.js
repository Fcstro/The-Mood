import Layout from '../layouts/layout.js';
import axios from 'axios';

export function renderLoginPage(container, spa) {
    const formContainer = document.createElement('div');
    formContainer.className = 'login-form-container';
    formContainer.innerHTML = `
        <h4 class="text-center mb-4">LOG IN</h4>
        <form id="login-form">
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="username-email" placeholder="Username or Email" required>
                <label for="username-email">Username or Email</label>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                <label for="password">Password</label>
                <span class="toggle-password" id="toggle-password">
                    <i id="eye-icon-password" class="fas fa-eye"></i>
                </span>
            </div>

            <button type="submit" id="login-btn" class="btn btn-primary">Login</button>
            <div class="text-center mt-2">
                <a href="/forget" id="forgot-password-link" class="text-white">Forgot Password?</a>
            </div>
        </form>
    `;

    // Use the Layout function to render the page
    Layout(container, formContainer, spa);

    // Add event listener for the login form submission after the form is rendered
    formContainer.querySelector('#login-form').onsubmit = async (e) => {
        e.preventDefault();

        const identifier = document.getElementById('username-email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post('http://localhost:3000/v1/account/login', {
                identifier,
                password
            }, {
                headers: {
                    'apikey': '{public_key}'
                }
            });

            if (response.data.success) {
                // Handle successful login
                console.log('Login successful:', response.data);
                // Store the token if needed
                localStorage.setItem('token', response.data.data.token); // Store token

                // Store user information
                localStorage.setItem('username', response.data.data.username);
                localStorage.setItem('fullname', response.data.data.fullname);
                localStorage.setItem('profileImage', response.data.data.profileImage);
                localStorage.setItem('userId', response.data.data.userId);

                // Redirect to home page
                spa.redirect('/'); // Use the spa instance passed as an argument
                window.location.reload();
            } else {
                alert(response.data.message); // Show error message
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error);
            alert('An error occurred during login. Please try again.');
        }
    };
}