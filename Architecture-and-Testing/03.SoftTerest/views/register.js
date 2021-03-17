import { register } from '../src/api/data.js';

export function setupRegister(section, navigation) {
    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);

    return showRegister;

    async function showRegister() {
        return section;
    }

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const repeat = formData.get('repeatPassword');

        if (email == '' || password == '') {
            return alert('All fields are recuired!');
        } else if (password != repeat) {
            return alert('Passwords  don\'t match!');
        }

        await register(email, password);
        form.reset();

        navigation.setUserNavigation();
        navigation.goTo('home');
    }
}