function attachEvents() {
    const catchesDiv = document.getElementById('catches');
    catchesDiv.innerHTML = '';

    const loadBtn = document.querySelector('button[class=load]');
    loadBtn.addEventListener('click', (event) => loadCatches(event, catchesDiv));

    const addBtn = document.querySelector('#addForm [class=add]');
    if (sessionStorage.getItem('authToken')) {
        addBtn.disabled = false;
        addBtn.addEventListener('click', (event) => append(event, catchesDiv));
    }

    catchesDiv.addEventListener('click', (event) => updateOrDelete(event, catchesDiv));
}

async function loadCatches(e, mainDiv) {
    const response = await fetch('http://localhost:3030/data/catches');
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }
    const data = await response.json();

    mainDiv.innerHTML = data.map(element => {
        let buttons = `<button disabled class="update">Update</button>
        <button disabled class="delete">Delete</button>
        </div>`;

        if (element._ownerId == sessionStorage.getItem('id')) {
            buttons = `<button class="update">Update</button>
            <button class="delete">Delete</button>
            </div>`;
        };

        const catchDiv = `
        <div class="catch" id="${element._id}">
                    <label>Angler</label>
                    <input type="text" class="angler" value="${element.angler}" />
                    <hr>
                    <label>Weight</label>
                    <input type="number" class="weight" value="${Number(element.weight)}" />
                    <hr>
                    <label>Species</label>
                    <input type="text" class="species" value="${element.species}" />
                    <hr>
                    <label>Location</label>
                    <input type="text" class="location" value="${element.location}" />
                    <hr>
                    <label>Bait</label>
                    <input type="text" class="bait" value="${element.bait}" />
                    <hr>
                    <label>Capture Time</label>
                    <input type="number" class="captureTime" value="${Number(element.captureTime)}" />
                    <hr>` + buttons;
        return catchDiv;
    }).join('\n');
}

async function append(e, mainDiv) {
    const inputs = document.querySelectorAll('#addForm>input');
    const angler = inputs[0].value;
    const weight = Number(inputs[1].value);
    const species = inputs[2].value;
    const location = inputs[3].value;
    const bait = inputs[4].value;
    const captureTime = Number(inputs[5].value);

    if (angler == '' || weight == '' || species == '' || location == '' || bait == '' || captureTime == '') {
        alert('All fields are recuired!');
        return;
    }

    const toAdd = {
        'angler': angler,
        'weight': weight,
        'species': species,
        'location': location,
        'bait': bait,
        'captureTime': captureTime
    };

    const response = await fetch('http://localhost:3030/data/catches/', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.getItem('authToken')
        },
        body: JSON.stringify(toAdd)
    });
    if (response.ok == false) {
        alert(response.statusCode);
        return;
    }
    inputs[0].value = '';
    inputs[1].value = '';
    inputs[2].value = '';
    inputs[3].value = '';
    inputs[4].value = '';
    inputs[5].value = '';

    loadCatches(e, mainDiv);
}

async function updateOrDelete(e, mainDiv) {
    if (e.target.className == 'update') {
        const id = e.target.parentNode.getAttribute('id');

        const catchDiv = document.getElementById(id);
        const inputs = catchDiv.children;
        const angler = inputs[1].value;
        const weight = Number(inputs[4].value);
        const species = inputs[7].value;
        const location = inputs[10].value;
        const bait = inputs[13].value;
        const captureTime = Number(inputs[16].value);

        if (angler == '' || weight == '' || species == '' || location == '' || bait == '' || captureTime == '') {
            alert('All fields are recuired!');
            return;
        }

        const updated = {
            'angler': angler,
            'weight': weight,
            'species': species,
            'location': location,
            'bait': bait,
            'captureTime': captureTime
        };

        const response = await fetch('http://localhost:3030/data/catches/' + id, {
            method: 'put',
            headers: { 'X-Authorization': sessionStorage.getItem('authToken') },
            body: JSON.stringify(updated)
        });
        if (response.ok == false) {
            alert('The request is not correct!');
            return;
        }
        loadCatches(e, mainDiv);

    } else if (e.target.className == 'delete') {
        const id = e.target.parentNode.getAttribute('id');

        const response = await fetch('http://localhost:3030/data/catches/' + id, {
            method: 'delete',
            headers: { 'X-Authorization': sessionStorage.getItem('authToken') }
        });
        if (response.ok == false) {
            alert('The request is not correct!');
            return;
        }
        loadCatches(e, mainDiv);
    }
}

attachEvents();

