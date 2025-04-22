import { HomepageLayout } from '../layouts/homeLayout.js';
import axios from 'axios';

export async function renderSettingsPage(container, spa) {
    const mainContent = document.createElement('div');
    mainContent.className = 'settings-content';

    mainContent.innerHTML = `
    <h1 class="setting-h1">Settings</h1>
    <div class="setting-option">
        <div id="change-name" class="name-fields">
            <h2>Change Name</h2>
            <h5>Current Full Name</h5>
            <input type="text" id="full-name" placeholder="Fullname Holder" disabled>
            <h5>New First Name</h5>
            <input type="text" id="first-name-input" placeholder="Enter First Name">
            <h5>New Last Name</h5>
            <input type="text" id="last-name-input" placeholder="Enter Last Name">
            <button class="save-btn" id="save-name-btn" disabled>Save</button>
        </div>
    </div>
    <div class="setting-option">
        <div id="change-username" class="change-username">
            <h2>Change Username</h2>
            <h5>Current Username</h5>
            <input type="text" id="current-username" placeholder="Current username Holder" disabled>
            <h5>New Username</h5>
            <input type="text" id="new-username" placeholder="Enter new username">
            <button class="save-btn" id="save-username-btn" disabled>Save</button>
        </div>
    </div>
    <div class="setting-option">
        <div id="change-email" class="change-email">
            <h2>Change Email</h2>
            <h5>Current Email Address</h5>
            <input type="email" id="current-email-input" placeholder="Current email Holder" disabled>
            <h5>New Email Address</h5>
            <input type="email" id="new-email-input" placeholder="Enter new email" required>
            <button class="save-btn" id="save-email-btn" disabled>Save</button>
        </div>
    </div>
    <div class="setting-option">
        <div id="change-password" class="password-fields">
            <h2>Change Password</h2>
            <h5>Current Password</h5>
            <input type="password" id="old-password-input" placeholder="Old Password" required>
            <h5>New Password</h5>
            <input type="password" id="new-password-input" placeholder="New Password" required>
            <h5>Confirm New Password</h5>
            <input type="password" id="confirm-password-input" placeholder="Confirm Password" required>
            <button class="setting-save-btn" id="save-password-btn" disabled>Save</button>
        </div>
    </div>
    <button id="logout-button" class="logout-button">Log Out</button>
    `;

    HomepageLayout(container, mainContent);

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found in localStorage');
        alert('Please log in again.');
        spa.redirect('/login');
        return;
    }

    await fetchUserProfile(token);

    async function fetchUserProfile(token) {
        try {
            const response = await axios.get('http://localhost:3000/v1/account/profile', {
                headers: {
                    'token': token,
                    'apikey': '{public_key}'
                }
            });

            const { fullname, email, username } = response.data.data;

            document.getElementById('full-name').value = fullname;
            document.getElementById('current-username').value = username;
            document.getElementById('current-email-input').value = email;

        } catch (error) {
            console.error('Error fetching profile data:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please log in again.');
                spa.redirect('/login');
            } else {
                alert('Failed to load profile data. Please try again later.');
            }
        }
    }

    function checkInputs() {
        const firstName = document.getElementById('first-name-input').value.trim();
        const lastName = document.getElementById('last-name-input').value.trim();
        const newUsername = document.getElementById('new-username').value.trim();
        const newEmail = document.getElementById('new-email-input').value.trim();
        const oldPassword = document.getElementById('old-password-input').value.trim();
        const newPassword = document.getElementById('new-password-input').value.trim();
        const confirmPassword = document.getElementById('confirm-password-input').value.trim();

        document.getElementById('save-name-btn').disabled = !(firstName && lastName);
        document.getElementById('save-username-btn').disabled = !newUsername;
        document.getElementById('save-email-btn').disabled = !newEmail;
        document.getElementById('save-password-btn').disabled = !(oldPassword && newPassword && confirmPassword);
    }

    document.getElementById('first-name-input').addEventListener('input', checkInputs);
    document.getElementById('last-name-input').addEventListener('input', checkInputs);
    document.getElementById('new-username').addEventListener('input', checkInputs);
    document.getElementById('new-email-input').addEventListener('input', checkInputs);
    document.getElementById('old-password-input').addEventListener('input', checkInputs);
    document.getElementById('new-password-input').addEventListener('input', checkInputs);
    document.getElementById('confirm-password-input').addEventListener('input', checkInputs);

    function clearInputFields() {
        document.getElementById('first-name-input').value = '';
        document.getElementById('last-name-input').value = '';
        document.getElementById('new-username').value = '';
        document.getElementById('new-email-input').value = '';
        document.getElementById('old-password-input').value = '';
        document.getElementById('new-password-input').value = '';
        document.getElementById('confirm-password-input').value = '';
    }

    document.getElementById('save-name-btn').addEventListener('click', async () => {
        const firstName = document.getElementById('first-name-input').value;
        const lastName = document.getElementById('last-name-input').value;

        if (confirm('Are you sure you want to save the changes to your name?')) {
            try {
                await axios.put('http://localhost:3000/v1/account', {
                    firstName,
                    lastName
                }, {
                    headers: {
                        'token': token,
                        'apikey': '{public_key}'
                    }
                });
                alert('Name updated successfully!');
                await fetchUserProfile(token);
                clearInputFields();
                HomepageLayout(container, mainContent);

            } catch (error) {
                console.error('Error updating name:', error.response ? error.response.data : error.message);
                alert('Failed to update name. Please try again later.');
            }
        }
    });

    document.getElementById('save-username-btn').addEventListener('click', async () => {
        const newUsername = document.getElementById('new-username').value;

        if (confirm('Are you sure you want to save the changes to your username?')) {
            try {
                await axios.put('http://localhost:3000/v1/account', {
                    username: newUsername
                }, {
                    headers: {
                        'token': token,
                        'apikey': '{public_key}'
                    }
                });
                alert('Username updated successfully!');
                await fetchUserProfile(token);
                clearInputFields();
                HomepageLayout(container, mainContent);
            } catch (error) {
                console.error('Error updating username:', error.response ? error.response.data : error.message);
                alert('Failed to update username. Please try again later.');
            }
        }
    });

    document.getElementById('save-email-btn').addEventListener('click', async () => {
        const newEmail = document.getElementById('new-email-input').value;

        if (confirm('Are you sure you want to save the changes to your email?')) {
            try {
                await axios.put('http://localhost:3000/v1/account', {
                    email: newEmail
                }, {
                    headers: {
                        'token': token,
                        'apikey': '{public_key}'
                    }
                });
                alert('Email updated successfully!');
                await fetchUserProfile(token);
                clearInputFields();
                HomepageLayout(container, mainContent);

            } catch (error) {
                console.error('Error updating email:', error.response ? error.response.data : error.message);
                alert('Failed to update email. Please try again later.');
            }
        }
    });

    document.getElementById('save-password-btn').addEventListener('click', async () => {
        const oldPassword = document.getElementById('old-password-input').value;
        const newPassword = document.getElementById('new-password-input').value;
        const confirmPassword = document.getElementById('confirm-password-input').value;

        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        if (confirm('Are you sure you want to save the changes to your password?')) {
            try {
                await axios.put('http://localhost:3000/v1/account/password/reset', {
                    currentPassword: oldPassword,
                    newPassword: newPassword
                }, {
                    headers: {
                        'token': token,
                        'apikey': '{public_key}'
                    }
                });
                alert('Password updated successfully!');
                await fetchUserProfile(token);
                clearInputFields();
                HomepageLayout(container, mainContent);

            } catch (error) {
                console.error('Error updating password:', error.response ? error.response.data : error.message);
                if (error.response && error.response.status === 401) {
                    alert('Session expired. Please log in again.');
                    spa.redirect('/login');
                } else if (error.response && error.response.data && error.response.data.message === 'Invalid current password') {
                    alert('Invalid current password. Please try again.');
                } else {
                    alert('Failed to update password. Please try again later.');
                }
            }
        }
    });

    const logoutButton = mainContent.querySelector('#logout-button');
    logoutButton.addEventListener('click', () => {
        spa.redirect('/logout');
    });
}