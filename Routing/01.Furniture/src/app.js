import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';
import { logout } from '../api/api.js';

import { dashboardPage } from '../views/dashboard.js';
import { detailsPage } from '../views/details.js';
import { registerPage } from '../views/register.js';
import { loginPage } from '../views/login.js';
import { createPage } from '../views/create.js';
import { editPage } from '../views/edit.js';
import { myFurniturePage } from '../views/my-furniture.js';

page('/', renderMiddleware, dashboardPage);
page('/dashboard', renderMiddleware, dashboardPage);
page('/details/:id', renderMiddleware, detailsPage);
page('/register', renderMiddleware, registerPage);
page('/login', renderMiddleware, loginPage);
page('/create', renderMiddleware, createPage);
page('/edit/:id', renderMiddleware, editPage);
page('/my-furniture', renderMiddleware, myFurniturePage);

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    setUserNav();
    page.redirect('/');
});

setUserNav();

// Start app
page.start();

function renderMiddleware(ctx, next) {
	ctx.render = (content) => render(content, document.querySelector('.container'));
    ctx.setUserNav = setUserNav;
	next();
}

function setUserNav() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        document.getElementById('user').style.display = '';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = '';
    }
}