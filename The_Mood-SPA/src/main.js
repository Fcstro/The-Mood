
import { renderLoginPage } from './pages/login.js';
import { renderSignupPage } from './pages/signup.js';
import { renderHomePage } from './pages/home.js'; 
import { renderUserPage } from './pages/user.js';
import { renderForgetPage } from './pages/forget.js'; 
import { renderExplorePage } from './pages/explore.js';
import { renderSettingsPage } from './pages/settings.js';
import { renderFollowerPage } from './pages/follower.js';
import { renderNotFoundPage } from './pages/notFound.js';
import SPA from './core/spa'; 

// Function to dynamically import jwt-decode



document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    console.log("App container found:", appContainer);

    const spa = new SPA({
        root: appContainer,
        defaultRoute: renderLoginPage // Set the default route to the login page
    });

    // Register routes
    spa.add('/login', () => {
        console.log("Navigating to login page");
        renderLoginPage(appContainer, spa); // Pass the spa instance
    });
    spa.add('/signup', () => {
        console.log("Navigating to signup page");
        renderSignupPage(appContainer, spa);
    });
    spa.add('/forget', () => {
        console.log("Navigating to forgot password page");
        renderForgetPage(appContainer, spa); 
    });
    spa.add('/', () => {
        console.log("Navigating to home page");
        
        const token = localStorage.getItem('token'); 
    
        if (!token) {
            spa.redirect('/login');
        } else {
            renderHomePage(appContainer);
            
        }
    });
    spa.add('/user', async () => {
        console.log("Navigating to User Profile page");
        const token = localStorage.getItem('token'); 
    
        if (!token) {
            spa.redirect('/login');
        } else {
            renderUserPage(appContainer);
        }
    });
    spa.add('/explore', async () => {
        console.log("Navigating to Explore page");
        const token = localStorage.getItem('token'); 
    
        if (!token) {
            spa.redirect('/login');
        }  else {
            renderExplorePage(appContainer);
        }
    });
    spa.add('/settings', async () => {
        console.log("Navigating to Settings page");
        const token = localStorage.getItem('token'); 
    
        if (!token) {
            spa.redirect('/login');
        } else {
            renderSettingsPage(appContainer, spa);
        }
    });

    spa.add('/followers', async () => {
        console.log("Navigating to Followers page");
        const token = localStorage.getItem('token'); 
    
        if (!token) {
            spa.redirect('/login');
        } else {
            renderFollowerPage(appContainer, spa);
        }
    });
    spa.add('/logout', () => { console.log("Logging out...");
        console.log(sessionStorage)
        sessionStorage.clear()
        localStorage.removeItem('token'); 
        spa.redirect('/login'); 
    });


    spa.add('*', () => {
        console.log("Navigating to a non-existent page");
        renderNotFoundPage(appContainer); // Render the 404 page
    });

    // Handle route changes
    spa.handleRouteChanges();
});