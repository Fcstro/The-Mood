// pages/signup.js
import Layout from '../layouts/layout.js';
import axios from 'axios';

export function renderSignupPage(container, spa) {
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    formContainer.innerHTML = `
        <h4 class="text-center mb-4">SIGN UP</h4>
        <form id="signup-form">
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="first_name" placeholder="First Name" required>
                <label for="first_name">First Name</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="last_name" placeholder="Last Name" required>
                <label for="last_name">Last Name</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="username" placeholder="Username" required>
                <label for="username">Username</label>
            </div>
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id="email" placeholder="Email" required>
                <label for="email">Email</label>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                <label for="password">Password</label>
                <span class="toggle-password" id="toggle-password">
                    <i id="eye-icon-password" class="fas fa-eye"></i>
                </span>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password" required>
                <label for="confirm_password">Confirm Password</label>
                <span class="toggle-password" id="toggle-confirm-password">
                    <i id="eye-icon-confirm-password" class="fas fa-eye"></i>
                </span>
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
        </form>
    `;

    formContainer.querySelector('#signup-form').onsubmit = async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return; // Prevent form submission
        }

        try {
            const response = await axios.post('http://localhost:3000/v1/account/', {
                firstName,
                lastName,
                username,
                email,
                password
            },{
                    headers: {
                        'apikey': '{public_key}'
                    }

            } );

            if (response.data.success) {
                alert('Signup successful!'); // Handle success (e.g., redirect to login)
                spa.redirect('/login'); // Redirect to login page
            } else {
                // Use the API's error message
                alert(response.data.message); // Show error message from API
            }
        } catch (error) {
            // Handle network or unexpected errors
            if (error.response && error.response.data) {
                // If the error response has a message, show it
                alert(error.response.data.message);
            } else {
                console.error('Error during signup:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    // Use the Layout function to render the page
    Layout(container, formContainer, spa);
}