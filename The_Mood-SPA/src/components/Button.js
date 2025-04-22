// components/Button.js
export function Button({ text, onClick, className }) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.onclick = onClick;
    return button;
}