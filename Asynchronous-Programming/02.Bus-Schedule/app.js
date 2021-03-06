function solve() {
    const info = document.getElementById('info').children[0];
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    
    let id = 'depot';
    let data;

    async function depart() {
        try {
            const url = `http://localhost:3030/jsonstore/bus/schedule/${id}`;
            const response = await fetch(url);
            if (response.ok == false) {
                throw new Error('Error');
            }
            data = await response.json();
            info.textContent = `Next stop ${data.name}`;
            departBtn.disabled = true;
            arriveBtn.disabled = false;

            id = data.next;
        } catch (error) {
            info.textContent = 'Error';
            arriveBtn.disabled = true;
            departBtn.disabled = true;
        }
    }

    function arrive() {
        info.textContent = `Arriving at ${data.name}`;
        arriveBtn.disabled = true;
        departBtn.disabled = false;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();