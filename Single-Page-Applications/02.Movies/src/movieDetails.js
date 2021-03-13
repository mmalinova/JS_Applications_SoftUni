import { e } from './dom.js';
import { showHome } from './home.js';
import { showEdit } from './editMovie.js';

async function getLikesByMovieId(id) {
    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`);
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    const data = await response.json();
    return data;
}

async function getOwnLikesByMovieId(id) {
    const userId = sessionStorage.getItem('userId');

    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22${userId}%22`);
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    const data = await response.json();
    return data;
}

export async function getMovieById(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    const data = await response.json();
    return data;
}

async function onDelete(event, id) {
    event.preventDefault();

    const confirmed = confirm('Are you sure you want to delete this movie?');
    if (confirmed) {
        const response = await fetch('http://localhost:3030/data/movies/' + id, {
            method: 'delete',
            headers: { 'X-Authorization': sessionStorage.getItem('authToken') },
        });
        if (response.ok == false) {
            const error = await response.json();
            alert(error.message);
            return;
        }

        alert('Movie deleted!');

        showHome();
    }
}

function createMovieCard(movie, likes, ownLike) {
    const buttons = e('div', { className: 'col-md-4 text-center' },
        e('h3', { className: 'my-3' }, 'Movie Description'),
        e('p', {}, movie.description)
    );

    const userId = sessionStorage.getItem('userId');

    if (userId != null) {
        if (userId == movie._ownerId) {
            buttons.appendChild(e('a', { className: 'btn btn-danger', href: '#', onClick: (event) => onDelete(event, movie._id) }, 'Delete'));
            buttons.appendChild(e('a', { className: 'btn btn-warning', href: '#', onClick: (e) => showEdit(movie._id) }, 'Edit'));
        } else if (ownLike.length == 0) {
            buttons.appendChild(e('a', { className: 'btn btn-primary', href: '#', onClick: likeMovie }, 'Like'));
        }
    }
    const likesSpan = e('span', { className: 'enrolled-span' }, likes + ' like' + (likes == 1 ? '' : 's'));
    buttons.appendChild(likesSpan);

    const element = document.createElement('div');
    element.className = 'container';
    element.appendChild(e('div', { className: 'row bg-light text-dark', id: movie},
        e('h1', {}, `Movie title: ${movie.title}`),
        e('div', { className: 'col-md-8' }, e('img', { className: 'img-thumbnail', src: movie.img })),
        buttons
    ));

    return element;

    async function likeMovie(event) {
        const response = await fetch('http://localhost:3030/data/likes', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': sessionStorage.getItem('authToken')
            },
            body: JSON.stringify({ movieId: movie._id })
        });
        if (response.ok == false) {
            const error = await response.json();
            alert(error.message);
            return;
        }
        event.target.remove();

        //Increment likes
        likes++;
        likesSpan.textContent = likes + ' like' + (likes == 1 ? '' : 's');
    }
}

let main;
let section;

export function setupDetails(mainSection, currentSection) {
    main = mainSection;
    section = currentSection;
}

export async function showDetails(id) {
    section.innerHTML = '';
    main.innerHTML = '';
    main.appendChild(section);

    const [movie, likes, ownLike] = await Promise.all([
        getMovieById(id),
        getLikesByMovieId(id),
        getOwnLikesByMovieId(id)
    ]);

    const card = createMovieCard(movie, likes, ownLike);
    section.appendChild(card);
}