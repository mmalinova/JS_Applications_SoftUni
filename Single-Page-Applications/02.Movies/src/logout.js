import { showHome } from './home.js';

export async function logout() {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: {'X-Authorization': token}
    });
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');

    [...document.querySelectorAll('nav .user')].forEach(element => {
        element.style.display = 'none';
    });
    [...document.querySelectorAll('nav .guest')].forEach(element => {
        element.style.display = 'block';
    });

    showHome();
}