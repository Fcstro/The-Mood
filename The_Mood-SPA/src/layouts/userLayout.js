// layouts/userLayout.js
import { Header } from '../components/homeheader.js';
import { Navigation } from '../components/navigation.js';

export function UserLayout(container, mainContent) {
    container.innerHTML = ''; // Clear the container


    
    // Create user header
    const header = Header();

    // Create sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    Navigation(sidebar); // Populate navigation links

    // Create main area
    const main = document.createElement('main');
    main.className = 'content';
    main.appendChild(mainContent);

    // Append all elements to the container
    container.appendChild(header);
    container.appendChild(sidebar);
    container.appendChild(main);
}