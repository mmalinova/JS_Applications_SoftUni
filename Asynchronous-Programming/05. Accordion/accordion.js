function solution() {
    const main = document.getElementById('main');

    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

    fetch(url)
        .then(response => {
            if (response.ok == false) {
                throw new Error('Error');
            }
            const data = response.json();
            return data;
        })
        .then(data => {
            data.forEach(e => {
                createArticle(e);
            });
        })
        .catch(error => console.log(error.message));

    function createArticle(e) {
        const mainDiv = createEl('div', null, ['class = accordion']);
        const innerDiv = createEl('div', null, ['class = head']);
        const span = createEl('span', `${e.title}`);
        const button = createEl('buuton', 'More', ['class = button', `id = ${e._id}`]);
        button.addEventListener('click', toggle);

        innerDiv.appendChild(span);
        innerDiv.appendChild(button);

        mainDiv.appendChild(innerDiv);

        const secondInnerDiv = createEl('div', null, ['class = extra', 'style = display:none']);
        const p = createEl('p');
        secondInnerDiv.appendChild(p);

        mainDiv.appendChild(secondInnerDiv);

        main.appendChild(mainDiv);
    }

    function toggle(e) {
        const id = e.target.getAttribute('id');
        const url = `http://localhost:3030/jsonstore/advanced/articles/details/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok == false) {
                    throw new Error('Error');
                }
                const data = response.json();
                return data;
            })
            .then(data => {
                let text = data.content;
                const div = e.target.parentNode.parentNode;

                const divExtra = div.children[1];
                const p = divExtra.children[0];
                p.textContent = text;

                if (e.target.innerHTML === 'More') {
                    divExtra.style.display = 'block';
                    e.target.innerHTML = 'Less';
                } else if (e.target.innerHTML === 'Less') {
                    divExtra.style.display = 'none';
                    e.target.innerHTML = 'More';
                }
            })
            .catch(error => console.log(error.message));
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