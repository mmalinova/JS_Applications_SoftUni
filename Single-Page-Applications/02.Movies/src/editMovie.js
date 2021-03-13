import { showDetails, getMovieById } from './movieDetails.js';

async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const id = document.querySelector('form>.form-group>.hiddenId').id;

    const movie = {
        title: formData.get('title'),
        description: formData.get('description'),
        img: formData.get('imageUrl'),
    };

    if (movie.title == '' || movie.description == '' || movie.img == '') {
        return alert('All fields are recuired!');
    }

    const response = await fetch('http://localhost:3030/data/movies/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.getItem('authToken')
        },
        body: JSON.stringify(movie)
    });
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    event.target.reset();

    showDetails(id);
}

async function getOldData(id, section){
    const movie = await getMovieById(id);
    section.querySelectorAll('.form-group input')[0].value = movie.title;
    section.querySelectorAll('.form-group textarea')[0].innerText = movie.description;
    section.querySelectorAll('.form-group input')[1].value = movie.img;

    const hiddenId = document.createElement('div');
    hiddenId.className = 'hiddenId';
    hiddenId.id = movie._id;
    hiddenId.style.display = 'none';
    section.querySelector('.form-group').appendChild(hiddenId);
}

let main;
let section;

export function setupEdit(mainSection, currentSection) {
    main = mainSection;
    section = currentSection;

    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showEdit(id) {
    main.innerHTML = '';
    main.appendChild(section);

    getOldData(id, section);
}