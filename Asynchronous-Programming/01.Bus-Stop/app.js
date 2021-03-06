async function getInfo() {
    const stop = document.getElementById('stopId');
    const stopName = document.getElementById('stopName');
    const buses = document.getElementById('buses');
    const submit = document.getElementById('submit');

    const url = `http://localhost:3030/jsonstore/bus/businfo/${stop.value}`;
    submit.disabled = true;
    try {
        buses.innerHTML = '';
        const response = await fetch(url);
        submit.disabled = false;
        if (response.ok == false) {
            throw new Error('Error');
        }
        const data = await response.json();
        stopName.textContent = data.name;

        Object.entries(data.buses).map(([key, value]) => {
            let li = document.createElement('li');
            li.textContent = `Bus ${key} arrives in ${value} minutes`;
            buses.appendChild(li);
        });

        stop.value = '';
    } catch(error) {
        stopName.textContent = 'Error';
    }
}