// components/userHeader.js
export function UserHeader() {
    const header = document.createElement('header');
    header.className = 'user-header';

   const logo = document.createElement('img');
    logo.src = 'https://res.cloudinary.com/dw44z8kbk/image/upload/v1730026980/download_pj4qzs.png';
    logo.alt = 'logo';
    logo.className = 'home-logo';

    header.appendChild(logo);
    return header;
}