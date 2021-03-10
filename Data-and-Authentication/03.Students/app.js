viewAllPersons();

const submitBtn = document.getElementById('submit');
const inputs = document.querySelectorAll('div>input');
submitBtn.addEventListener('click', appendPerson);

async function viewAllPersons() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/students');
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }
    const data = await response.json();

    document.querySelector('tbody').innerHTML = Object.values(data).map(e => {
        const row = `
        <tr>
            <td>${e.firstName}</td>
            <td>${e.lastName}</td>
            <td>${e.facultyNumber}</td>
            <td>${e.grade}</td>
        </tr>`;

       return row;
    }).join('');
    
}

async function appendPerson(e) {
    e.preventDefault();

    const firstName = inputs[0].value;
    const lastName = inputs[1].value;
    const facultyNumber = inputs[2].value;
    const grade = Number(inputs[3].value);

    if (firstName == '' || lastName == '' || facultyNumber == '' || grade == '') {
        alert('All fields are recuired!');
        return;
    }
    if (!grade) {
        alert('Grade must be a number!');
        return;
    }

    const response = await fetch('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({firstName, lastName, facultyNumber, grade})
    });
    if (response.ok == false) {
        alert('The request is not correct!');
        return;
    }

    inputs[0].value = '';
    inputs[1].value = '';
    inputs[2].value = '';
    inputs[3].value = '';

    viewAllPersons();
}