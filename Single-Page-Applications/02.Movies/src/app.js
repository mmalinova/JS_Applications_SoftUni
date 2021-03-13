import { setupHome, showHome } from './home.js';
import { setupDetails } from './movieDetails.js';
import { setupLogin, showLogin } from './login.js';
import { setupRegister, showRegister } from './register.js';
import { setupAdd } from './addMovie.js';
import { setupEdit } from './editMovie.js';
import { logout } from './logout.js';

const main = document.querySelector('main');

const links = {
    'homeLink': showHome,
    'loginLink': showLogin,
    'registerLink': showRegister,
    'logout': logout
};

setupSection('home-page', setupHome);
setupSection('movie-detail', setupDetails);
setupSection('form-login', setupLogin);
setupSection('form-sign-up', setupRegister);
setupSection('add-movie', setupAdd);
setupSection('edit-movie', setupEdit);

setupNav();

//Start app in home view
showHome();

function setupSection(sectionId, setup) {
    const section = document.getElementById(sectionId);
    setup(main, section);
}

function setupNav() {
    const email = sessionStorage.getItem('email');
    if (email != null) {
        document.getElementById('welcome-msg').textContent = `Welcome, ${email}`;

        [...document.querySelectorAll('nav .user')].forEach(element => {
            element.style.display = 'block';
        });
        [...document.querySelectorAll('nav .guest')].forEach(element => {
            element.style.display = 'none';
        });
    } else {
        [...document.querySelectorAll('nav .user')].forEach(element => {
            element.style.display = 'none';
        });
        [...document.querySelectorAll('nav .guest')].forEach(element => {
            element.style.display = 'block';
        });
    }

    document.querySelector('nav').addEventListener('click', (event) => {
        const view = links[event.target.id];
        if (typeof view == 'function') {
            event.preventDefault();
            view();
        }
    });
}