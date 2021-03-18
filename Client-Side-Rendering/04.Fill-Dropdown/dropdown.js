import { html, render } from '../node_modules/lit-html/lit-html.js';

async function addItem() {
    const data = await getItems();
    let options = Array.from(Object.values(data)).map(element => createTemplate(element));

    const menu = document.querySelector('#menu');
    render(options, menu);

    document.querySelector('form').addEventListener('submit', onSubmit);
}

function createTemplate(data) {
    return html`
    <option value=${data._id}>${data.text}</option>`;
}

async function getItems() {
    const response = await fetch('http://localhost:3030/jsonstore/advanced/dropdown');
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }
    return await response.json();
}

async function postItem(text) {
    const response = await fetch('http://localhost:3030/jsonstore/advanced/dropdown', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }
    addItem();
}

function onSubmit(event) {
    event.preventDefault();

    const item = event.target.querySelector('#itemText').value;
    if (!item) {
        return alert('Please, enter input!');
    }

    postItem(item);
    event.target.querySelector('#itemText').value = '';
}

addItem();