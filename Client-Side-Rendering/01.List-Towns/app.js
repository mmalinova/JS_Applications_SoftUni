import { html, render } from '../node_modules/lit-html/lit-html.js';

function attachEvents() {
    document.querySelector('form').addEventListener('submit', onSubmit);
}

function onSubmit(event) {
    event.preventDefault();

    let input = event.target.querySelector('input');
    let towns = input.value.split(',').map(e => e.trim());

    const template = (towns) = html`
    <ul>
        ${towns.map(town => (town ? html`
        <li>${town}</li>` : alert('Please add valid city name!')))}
    </ul>`;

    input.value = '';
    const root = document.getElementById('root');

    render(template, root);
}

attachEvents();