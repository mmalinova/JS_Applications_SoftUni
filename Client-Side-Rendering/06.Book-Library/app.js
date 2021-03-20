import { html, render } from '../node_modules/lit-html/lit-html.js';

function attachEvents() {
    const body = document.querySelector('body');

    const mainTemplate = html`
    <button id="loadBooks">LOAD ALL BOOKS</button>
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody @click=${updateOrDelete}>
        </tbody>
    </table>
    ${createAddForm()}
    ${createEditForm()}`;

    render(mainTemplate, body);
    document.querySelector('#loadBooks').addEventListener('click', onClick);
    document.querySelector('#add-form').addEventListener('submit', addBook);
}

async function updateOrDelete(event) {
    if (event.target.tagName == 'BUTTON') {
        const id = event.target.parentNode.parentNode.id;
        const form = document.querySelector('#edit-form');
        const addForm = document.querySelector('#add-form');
        if (event.target.textContent == 'Edit') {
            const booktoUpdate = await getBookById(id);

            addForm.style = 'display:none';
            form.style = '';

            form.querySelector('#author').value = booktoUpdate.author;
            form.querySelector('#title').value = booktoUpdate.title;

            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(event.target);
                const book = {
                    author: formData.get('author'),
                    title: formData.get('title')
                };
                if (book.title == '' || book.author == '') {
                    return alert('All fields are recuired!');
                }
                await updateBook(id, book);
                event.target.reset();

                form.style = 'display:none';
                addForm.style.display = '';
                onClick();
            });
        } else {
            if (confirm('Are you sure you want to delete this book?')) {
                await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
                    method: 'delete'
                });
                form.style = 'display:none';
                addForm.style.display = '';
                onClick();
            }
        }
    }
}

async function updateBook(id, book) {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
}

async function getBookById(id) {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books/' + id);
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }
    return await response.json();
}

function createEditForm() {
    return html`
    <form id="edit-form" style='display:none'>
        <input type="hidden" name="id">
        <h3>Edit book</h3>
        <label>TITLE</label>
        <input id="title" type="text" name="title" placeholder="Title...">
        <label>AUTHOR</label>
        <input id="author" type="text" name="author" placeholder="Author...">
        <input type="submit" value="Save">
    </form>`;
}

async function addBook(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const book = {
        author: formData.get('author'),
        title: formData.get('title')
    };
    if (book.title == '' || book.author == '') {
        return alert('All fields are recuired!');
    }
    await postBook(book);
    event.target.reset();

    onClick();
}

async function postBook(book) {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });

    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }
}

function createAddForm() {
    return html`
    <form id="add-form">
        <h3>Add book</h3>
        <label>TITLE</label>
        <input type="text" name="title" placeholder="Title...">
        <label>AUTHOR</label>
        <input type="text" name="author" placeholder="Author...">
        <input type="submit" value="Submit">
    </form>`;
}

async function onClick() {
    const books = await getAllBooks();
    const row = createRow(books);

    render(row, document.querySelector('tbody'));
}

async function getAllBooks() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books');
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }
    return await response.json();
}

function createRow(books) {
    return Object.entries(books).map(book => html`
    <tr id=${book[0]}>
        <td>${book[1].title}</td>
        <td>${book[1].author}</td>
        <td>
            <button>Edit</button>
            <button>Delete</button>
        </td>
    </tr>`);
}

attachEvents();