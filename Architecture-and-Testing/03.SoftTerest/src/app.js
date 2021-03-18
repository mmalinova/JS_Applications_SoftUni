import { setupHome } from '../views/home.js';
import { setupDashboard } from '../views/dashboard.js';
import { setupRegister } from '../views/register.js';
import { setupLogin } from '../views/login.js';
import { setupCreate } from '../views/create.js';
import { setupDetails } from '../views/details.js';
import { setupLogout } from '../views/logout.js';

const views = {};
const links = {};

const main = document.querySelector('main');
const nav = document.querySelector('nav');

const navigation = {
    goTo,
    setUserNavigation
};

registerView('home', document.getElementById('home-page'), setupHome, 'homeLink');
registerView('dashboard', document.getElementById('dashboard-holder'), setupDashboard, 'dashboardLink');
registerView('register', document.getElementById('register-page'), setupRegister, 'registerLink');
registerView('login', document.getElementById('login-page'), setupLogin, 'loginLink');
registerView('create', document.getElementById('create-page'), setupCreate, 'createLink');
registerView('details', document.getElementById('details-page'), setupDetails);


document.getElementById('views').remove();

document.getElementById('logoutBtn').addEventListener('click', setupLogout(navigation));

setupNavigation();

//Start app from home page
goTo('home');

function registerView(name, section, setup, linkId) {
    const view = setup(section, navigation);
    views[name] = view;
    if (linkId) {
        links[linkId] = name;
    }
}

async function goTo(name, ...params) {
    main.innerHTML = '';
    const view = views[name];
    const section = await view(...params);
    main.appendChild(section);
}

function setupNavigation() {
    setUserNavigation();

    nav.addEventListener('click', (event) => {
        const viewName = links[event.target.id];
        if (viewName) {
            event.preventDefault();
            goTo(viewName);
        }
    });
}

function setUserNavigation() {
    const token = sessionStorage.getItem('authToken');
    if (token != null) {
        [...nav.querySelectorAll('.user-nav')].forEach(e => e.style.display = 'list-item');
        [...nav.querySelectorAll('.guest-nav')].forEach(e => e.style.display = 'none');
    } else {
        [...nav.querySelectorAll('.user-nav')].forEach(e => e.style.display = 'none');
        [...nav.querySelectorAll('.guest-nav')].forEach(e => e.style.display = 'list-item');
    }
}