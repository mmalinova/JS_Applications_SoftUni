function attachEvents() {
    const loadBtn = document.getElementById('btnLoad');
    loadBtn.addEventListener('click', load);

    const createBtn = document.getElementById('btnCreate');
    createBtn.addEventListener('click', createContact);
}

async function load(e) {
    const response = await fetch('http://localhost:3030/jsonstore/phonebook');
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }
    const data = await response.json();
    display(data);
}

function display(data) {
    const ul = document.getElementById('phonebook');
    ul.innerHTML = '';

    Object.values(data).forEach(e => {
        const li = document.createElement('li');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';

        li.textContent = `${e.person}: ${e.phone}`;
        li.appendChild(deleteBtn);
        ul.appendChild(li);

        deleteBtn.addEventListener('click', (event) => deleteEntry(event, e._id));
    });
}

async function deleteEntry(e, key) {
    const url = 'http://localhost:3030/jsonstore/phonebook/' + key;
    const response = await fetch(url, {
        method: 'delete'
    });
    load();
}

async function createContact(e) {
    const person = document.getElementById('person').value;
    const phone = document.getElementById('phone').value;

    const response = await fetch('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ person, phone })
    });
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }
    document.getElementById('person').value = '';
    document.getElementById('phone').value = '';

    load();
}

attachEvents();