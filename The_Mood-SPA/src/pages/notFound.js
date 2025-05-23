// notFound.js
import { DefaultLayout } from "../layouts/default";

export function renderNotFoundPage(container) {
    const mainContent = document.createElement('div');
    mainContent.className = 'not-found-page';

    mainContent.innerHTML = `
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <a href="/" class="btn btn-primary">Go to Home</a>
    `;

    DefaultLayout(container, mainContent); 
}