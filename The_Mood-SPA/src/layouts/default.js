// layouts/userLayout.js
import { Header } from '../components/homeheader.js';


export function DefaultLayout(container, mainContent) {
    container.innerHTML = ''; // Clear the container


    
    // Create user header
    const header = Header();

    
    // Create main area
    const main = document.createElement('main');
    main.className = 'content';
    main.appendChild(mainContent);

    // Append all elements to the container
    container.appendChild(header);
    container.appendChild(main);
}