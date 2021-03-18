import { html, render } from '../node_modules/lit-html/lit-html.js';

function attachEvents() {
    document.querySelector('form').addEventListener('submit', onSubmit);
}

function onSubmit(event) {
    event.preventDefault();

    const input = event.target.querySelector('input').value;
    let towns = input.split(',').map(e => e.trim());

    const template = (towns) = html`
    <ul>
        ${towns.map(town => html`
        <li>${town}</li>`)}
    </ul>`;

    const root = document.getElementById('root');

    render(template, root);
}

attachEvents();