import { render } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';
import { logout } from './api/data.js';

import { homePage } from './views/home.js';
import { dashboardPage } from './views/dashboard.js';
import { detailsPage } from './views/details.js';
import { registerPage } from './views/register.js';
import { loginPage } from './views/login.js';
import { createPage } from './views/create.js';
import { editPage } from './views/edit.js';
import { searchPage } from './views/search.js';

page('/', renderMiddleware, homePage);
page('/home', renderMiddleware, homePage);
page('/dashboard', renderMiddleware, dashboardPage);
page('/details/:id', renderMiddleware, detailsPage);
page('/register', renderMiddleware, registerPage);
page('/login', renderMiddleware, loginPage);
page('/create', renderMiddleware, createPage);
page('/edit/:id', renderMiddleware, editPage);
page('/search', renderMiddleware, searchPage);

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    setUserNav();
    page.redirect('/');
});

setUserNav();

// Start app
page.start();

function renderMiddleware(ctx, next) {
    ctx.render = (content) => render(content, document.getElementById('main-content'));
    ctx.setUserNav = setUserNav;
    next();
}

function setUserNav() {
    const email = sessionStorage.getItem('email');
    if (email) {
        document.getElementById('user').style.display = '';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = '';
    }
}