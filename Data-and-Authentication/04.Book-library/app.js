document.querySelector('tbody').innerHTML = '';

const loadBtn = document.getElementById('loadBooks');
loadBtn.addEventListener('click', loadBooks);

const form = document.querySelector('#createBook');
form.addEventListener('submit', createBook);

document.querySelector('table').addEventListener('click', editOrDelete);

async function loadBooks(e) {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books');
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }
    const data = await response.json();

    document.querySelector('tbody').innerHTML = Object.entries(data).map(([key, values]) => {
        const row = `
        <tr id=${key}>
            <td>${values.title}</td>
            <td>${values.author}</td>
            <td>
                <button class='editBook'>Edit</button>
                <button class='deleteBook'>Delete</button>
            </td>
        </tr>`;

        return row;
    }).join('');
}

async function createBook(e) {
    e.preventDefault();

    const data = new FormData(e.target);
    const book = {
        title: data.get('title'),
        author: data.get('author')
    };

    if (book.title == '' || book.author == '') {
        alert('All fields are recuired!');
        return;
    }

    const response = await fetch('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }

    e.target.reset();
    loadBooks();
}

async function editOrDelete(e) {
    const id = e.target.parentNode.parentNode.getAttribute('id');

    if (e.target.className == 'editBook') {
        document.getElementById('createBook').style.display = 'none';
        document.getElementById('editBook').style.display = 'block';

        const book = await getBook(id);

        document.querySelector('#editBook [name=title]').value = book.title;
        document.querySelector('#editBook [name=author]').value = book.author;

        document.querySelector('#editBook').addEventListener('submit', (event) => editBook(event, id));

    } else if (e.target.className == 'deleteBook') {
        document.getElementById('createBook').style.display = 'block';
        document.getElementById('editBook').style.display = 'none';

        const response = await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
            method: 'delete'
        });
        if (response.ok == false) {
            alert('The request is not correct!');
            return;
        }

        loadBooks();
    }
}

async function getBook(id) {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books/' + id);
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }
    const data = await response.json();
    return data;
}

async function editBook(e, id) {
    e.preventDefault();

    const data = new FormData(e.target);
    const book = {
        title: data.get('title'),
        author: data.get('author')
    };

    if (book.title == '' || book.author == '') {
        alert('All fields are recuired!');
        return;
    }

    const response = await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }

    e.target.reset();
    document.getElementById('createBook').style.display = 'block';
    document.getElementById('editBook').style.display = 'none';
    loadBooks();
}