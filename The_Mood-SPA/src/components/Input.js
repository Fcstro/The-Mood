// components/Input.js
export function Input({ type, placeholder, id, required }) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.id = id;
    input.required = required;
    return input;
}