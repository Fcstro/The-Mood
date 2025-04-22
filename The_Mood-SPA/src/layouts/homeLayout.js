// layouts/HomepageLayout.js
import { Header } from '../components/homeheader.js';
import { Footer } from '../components/footer.js';
import { Navigation } from '../components/navigation.js';

export function HomepageLayout(container, mainContent) {
    container.innerHTML = ''; // Clear the container
    console.log("I been Called?")
    // Create header
    const header = Header();

    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    Navigation(sidebar); // Populate navigation links

    // Create main area
    const main = document.createElement('main');
    main.className = 'content';
    main.appendChild(mainContent); // Append the unique page content

    // Create footer
    const footer = Footer();

    // Append all elements to the container
    container.appendChild(header);
    container.appendChild(sidebar);
    container.appendChild(main);
    container.appendChild(footer);
}