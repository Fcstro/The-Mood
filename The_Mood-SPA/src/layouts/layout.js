// layouts/Layout.js
import { Header } from '../components/Header.js';
import { Footer } from '../components/footer.js';


export default function Layout(container, pageContent,spa) {
    container.innerHTML = ''; // Clear the container
        
    

    const header = Header({ spa });

    /*const header = Header({
        onLoginClick: () => {
            // Navigate to the login page
            spa.execute('/login');
        },
        onSignupClick: () => {
            // Navigate to the signup page
            spa.execute('/signup');
        }
    });*/

    const eclipseImage1 = document.createElement('img');
    eclipseImage1.src = 'icons/cld1.png'; 
    eclipseImage1.alt = 'Eclipse';
    eclipseImage1.className = 'eclipse-image';
    container.appendChild(eclipseImage1);

    const eclipseImage2 = document.createElement('img');
    eclipseImage2.src = 'icons/cld.png'; 
    eclipseImage2.alt = 'Eclipse';
    eclipseImage2.className = 'eclipse-images';
    container.appendChild(eclipseImage2);

    const logoImage = document.createElement('img');
    logoImage.src = 'icons/logo.png'; // Adjust the path as necessary
    logoImage.alt = 'Eclipse';
    logoImage.className = 'logo';
    container.appendChild(logoImage);

    const main = document.createElement('main');
    main.appendChild(pageContent); // Append the unique page content

    const footer = Footer();

    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(footer);
    
    if (!document.querySelector('.star')) {
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = star.style.width;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;
            document.body.appendChild(star);
        }
    }
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    const eyeIconPassword = document.getElementById("eye-icon-password");
    const eyeIconConfirmPassword = document.getElementById("eye-icon-confirm-password");
    const togglePassword = document.getElementById("toggle-password");
    const toggleConfirmPassword = document.getElementById("toggle-confirm-password");

    // Toggle visibility for password input
    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";  // Show the password
                eyeIconPassword.classList.remove("fa-eye");
                eyeIconPassword.classList.add("fa-eye-slash"); // Change to slashed eye
            } else {
                passwordInput.type = "password";  // Hide the password
                eyeIconPassword.classList.remove("fa-eye-slash");
                eyeIconPassword.classList.add("fa-eye"); // Change to open eye
            }
        });
    }
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener("click", () => {
            if (confirmPasswordInput.type === "password") {
                confirmPasswordInput.type = "text";  // Show the confirm password
                eyeIconConfirmPassword.classList.remove("fa-eye");
                eyeIconConfirmPassword.classList.add("fa-eye-slash"); // Change to slashed eye
            } else {
                confirmPasswordInput.type = "password";  // Hide the confirm password
                eyeIconConfirmPassword.classList.remove("fa-eye-slash");
                eyeIconConfirmPassword.classList.add("fa-eye"); // Change to open eye
            }
        });
    }

}
