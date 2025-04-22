// pages/forgotPassword.js
import Layout from '../layouts/layout.js';



export function renderForgetPage(container,spa) {
    const formContainer = document.createElement('div');
    formContainer.className = 'forget_password-container';
    formContainer.innerHTML = `
        <h4 class="text-center mb-4">FORGOT PASSWORD</h4>
        <form id="forgot-password-form">
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id="forgot-email" name="forgot-email" placeholder="Email" required>
                <label for="forgot-email">Enter Your Email</label>
            </div>
            <button type="submit" class="btn btn-primary">SEND</button>
        </form>
    `;

    // Use the Layout function to render the page
    Layout(container, formContainer,spa);

    // Add event listener for the form submission
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form from refreshing the page
            const email = document.getElementById('forgot-email').value;

            if (email) {
                // In a real application, you'd send this email to your server
                showAlert(`Password reset link has been sent to ${email}`, () => {
                    // Redirect to the login page after the alert is closed
                    spa.redirect('/login');
                });
            } else {
                showAlert('Please enter a valid email address.');
            }
        });
    }
}
function showAlert(message, callback) {
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    alertContainer.innerHTML = `
        <div class="alert">
            <p>${message}</p>
            <button id="alert-ok" class="btn btn-primary">OK</button>
        </div>
    `;
    document.body.appendChild(alertContainer);

    // Add event listener for the OK button
    document.getElementById('alert-ok').addEventListener('click', () => {
        document.body.removeChild(alertContainer);
         // Remove the alert
        if (callback) callback(); // Call the callback if provided
    });
}