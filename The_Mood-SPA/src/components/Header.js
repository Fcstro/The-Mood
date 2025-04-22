// components/Header.js
export function Header({ spa }) {
    const header = document.createElement('header');
    header.className = 'header';

    const loginButton = document.createElement('button');
    loginButton.className = 'btn login-btn';
    loginButton.textContent = 'Log In';
    loginButton.onclick = () => spa.redirect('/login'); 

    const signupButton = document.createElement('button');
    signupButton.className = 'btn signup-btn';
    signupButton.textContent = 'Sign Up';
    signupButton.onclick = () => spa.redirect('/signup'); 

    header.appendChild(loginButton);
    header.appendChild(signupButton);

    return header;
}