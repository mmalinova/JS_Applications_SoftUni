function lockedProfile() {
    const main = document.getElementById('main');

    const url = 'http://localhost:3030/jsonstore/advanced/profiles';

    fetch(url)
        .then(response => {
            if (response.ok == false) {
                throw new Error('Error');
            }
            const data = response.json();
            return data;
        })
        .then(data => {
            let values = [];
            Object.values(data).forEach(value => {
                values.push(value);
            });
            values.forEach((v) => {
                createCard(v);
            });
        })
        .catch(error => console.log(error.message));
    
    const container = document.getElementById('container');
    container.addEventListener('click', information);

    function information(e) {
        if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'INPUT') {
            const parent = e.target.parentElement;
            if (e.target.innerHTML === 'Show more') {
                const radio = Array.from(parent.children)[4];
                if (radio.checked) {
                const div = Array.from(parent.children)[8];
                div.style.display = 'block';
                e.target.innerHTML = 'Hide it';
                }
            } else if (e.target.innerHTML === 'Hide it') {
                const radio = Array.from(parent.children)[4];
                if (radio.checked) {
                const div = Array.from(parent.children)[8];
                div.style.display = 'none';
                e.target.innerHTML = 'Show more';
                }
            }
        }
    }
    main.innerHTML = '';

    function createCard(data) {
        const mainDiv = createEl('div', null, ['class = profile']);

        const img = createEl('div', null, ['src = ./iconProfile2.png', 'class = userIcon']);
        const firstLabel = createEl('label', 'Lock');
        const firstInput = createEl('input', null, ['type = radio', 'name = user1Locked', 'value = lock', 'checked']);
        const secondLabel = createEl('label', 'Unlock');
        const secondInput = createEl('input', null, ['type = radio', 'name = user1Locked', 'value = unlock']);
        const br = createEl('br');
        const hr = createEl('hr');
        const thirdLabel = createEl('label', 'Username');
        const thirdInput = createEl('input', null, ['type = text', 'name = user1Username', `value = ${data.username}`, 'disabled', 'readonly']);
        const innerDiv = createEl('div', null, ['id = user1HiddenFields']);

        mainDiv.appendChild(img);
        mainDiv.appendChild(firstLabel);
        mainDiv.appendChild(firstInput);
        mainDiv.appendChild(secondLabel);
        mainDiv.appendChild(secondInput);
        mainDiv.appendChild(br);
        mainDiv.appendChild(hr);
        mainDiv.appendChild(thirdLabel);
        mainDiv.appendChild(thirdInput);

        innerDiv.appendChild(hr);
        const firstInnerLabel = createEl('label', 'Email:');
        const firstInnerInput = createEl('input', null, ['type = email', 'name = user1Email', `value = ${data.email}`, 'disabled', 'readonly']);
        const secondInnerLabel = createEl('label', 'Age:');
        const secondInnerInput = createEl('input', null, ['type = email', 'name = user1Age', `value = ${data.age}`, 'disabled', 'readonly']);

        innerDiv.appendChild(firstInnerLabel);
        innerDiv.appendChild(firstInnerInput);
        innerDiv.appendChild(secondInnerLabel);
        innerDiv.appendChild(secondInnerInput);

        mainDiv.appendChild(innerDiv);

        const button = createEl('button', 'Show more');
        mainDiv.appendChild(button);

        main.appendChild(mainDiv);
    }

    function createEl(type, text, attributes = []) {
        let element = document.createElement(type);
        if (text) {
            element.textContent = text;
        }
        if (attributes) {
            for (const attribute of attributes) {
                let [name, value] = attribute.split(' = ');
                element.setAttribute(name, value);
            }
        }
        return element;
    }
}