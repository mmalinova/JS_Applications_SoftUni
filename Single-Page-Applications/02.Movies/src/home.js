import { showDetails } from './movieDetails.js';
import { showAdd } from './addMovie.js';

async function getMovies() {
    const response = await fetch('http://localhost:3030/data/movies/');
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    const data = await response.json();
    return data;
}

function createMoviePreview(movie) {
    const element = document.createElement('div');
    element.className = 'card mb-4';
    element.id = `${movie._id}`;
    element.innerHTML = `
        <img class="card-img-top" src="${movie.img}"
            alt="Card image cap" width="400">
        <div class="card-body">
            <h4 class="card-title">${movie.title}</h4>
        </div>
        <div class="card-footer">
                <button id="${movie._id}"type="button" class="btn btn-info movieDetails">Details</button>
        </div>
</div>`;

    return element;
}

let main;
let section;
let container;
let addLink = document.getElementById('addLink');

export function setupHome(mainSection, currentSection) {
    main = mainSection;
    section = currentSection;
    container = section.querySelector('.card-deck.d-flex.justify-content-center');

    container.addEventListener('click', event => {
        if (event.target.classList.contains('movieDetails')) {
            showDetails(event.target.id);
        }
    });
}

export async function showHome() {
    addLink.style.display = 'none';

    const email = sessionStorage.getItem('email');

    if (email != null) {
        document.getElementById('welcome-msg').textContent = `Welcome, ${email}`;
        addLink.style.display = 'inline-block';
        addLink.addEventListener('click', (event) => {
            event.preventDefault();
            showAdd();
        });
    }
    container.innerHTML = 'Loading&hellip;';
    main.innerHTML = '';
    main.appendChild(section);

    const movies = await getMovies();
    const cards = movies.map(createMoviePreview);

    const fragment = document.createDocumentFragment();
    cards.forEach(c => fragment.appendChild(c));

    container.innerHTML = '';
    container.appendChild(fragment);
}