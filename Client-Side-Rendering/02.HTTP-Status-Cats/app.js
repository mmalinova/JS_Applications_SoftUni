import { cats } from './catSeeder.js';
import { html, render } from '../node_modules/lit-html/lit-html.js';

function attachEvents() {
    const allCats = document.querySelector('#allCats');

    let input = cats;
    const template = (input) = html`
    <ul @click=${onClick}>
        ${input.map(cat => createCatCard(cat))};
    </ul>`;

    render(template, allCats);
}

function createCatCard(cat) {
    return html`
    <li>
        <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
        <div class="info">
            <button class="showBtn">Show status code</button>
            <div class="status" style="display: none" id="${cat.id}">
                <h4>Status Code: ${cat.statusCode}</h4>
                <p>${cat.statusMessage}</p>
            </div>
        </div>
    </li>`;
}

function onClick(event) {
    if (event.target.className == 'showBtn') {
        if (event.target.textContent.includes('Show')) {
            event.target.parentNode.querySelector('.status').style.display = '';
            event.target.textContent = 'Hide status code';
        } else {
            event.target.parentNode.querySelector('.status').style.display = 'none';
            event.target.textContent = 'Show status code';
        }
    }
}

attachEvents();