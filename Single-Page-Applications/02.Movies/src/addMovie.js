import {showHome} from './home.js';

async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const movie = {
        title: formData.get('title'),
        description: formData.get('description'),
        img: formData.get('imageUrl')
    };

    if (movie.title == '' ||  movie.description == '' || movie.img == '') {
        return alert('All fields are recuired!');
    }

    const response = await fetch('http://localhost:3030/data/movies/', {
        method: 'post',
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
    
    showHome();
}

let main;
let section;

export function setupAdd(mainSection, currentSection) {
    main = mainSection;
    section = currentSection;

    const form = document.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showAdd() {
    main.innerHTML = '';
    main.appendChild(section);
}