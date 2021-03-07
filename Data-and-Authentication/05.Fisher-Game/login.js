function attachEvents() {
    sessionStorage.clear();

    const forms = document.querySelectorAll('form');

    forms[0].addEventListener('submit', register);
    forms[1].addEventListener('submit', login);
}

async function register(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const user = {
        email: formData.get('email'),
        password: formData.get('password'),
        repeat: formData.get('rePass')
    };

    if (user.email == '' || user.password == '' || user.repeat == '') {
        alert('All fields are recuired!');
        return;
    }
    if (user.password != user.repeat) {
        alert('Passwords don\'t match!');
        return;
    }

    const response = await fetch('http://localhost:3030/users/register/', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    const data = await response.json();

    const token = data.accessToken;
    const id = data._id;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('id', id);

    e.target.reset();
    window.location.href = 'index.html';
}

async function login(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const user = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    if (user.email == '' || user.password == '') {
        alert('All fields are recuired!');
        return;
    }

    const response = await fetch('http://localhost:3030/users/login/', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        return;
    }
    const data = await response.json();

    const token = data.accessToken;
    const id = data._id;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('id', id);

    e.target.reset();
    window.location.href = 'index.html';
}

attachEvents();

