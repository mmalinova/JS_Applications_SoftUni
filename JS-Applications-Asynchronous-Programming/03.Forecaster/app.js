function attachEvents() {
    const forecast = document.getElementById('forecast');

    const weather = {
        Sunny: String.fromCharCode(0x2600),
        'Partly sunny': String.fromCharCode(0x26C5),
        Overcast: String.fromCharCode(0x2601),
        Rain: String.fromCharCode(0x2614),
        Degrees: String.fromCharCode(176)
    };

    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', async function () {
        const currentDiv = document.getElementById('current');
        const upcomingSpan = document.getElementById('upcoming');

        currentDiv.innerHTML = '';
        upcomingSpan.innerHTML = '';

        const location = document.getElementById('location').value;
        if (!location) {
            return;
        }
        const url = 'http://localhost:3030/jsonstore/forecaster/locations';
        const data = await makeRequest(url);

        const code = data.find(element => element.name.toLowerCase() === location.toLowerCase()).code;

        const urlCurrent = `http://localhost:3030/jsonstore/forecaster/today/${code}`;
        const dataCurrent = await makeRequest(urlCurrent);

        const divWithLabel = createEl('div', 'Current conditions', ['class = label']);
        currentDiv.appendChild(divWithLabel);
        
        const divForecast = createEl('div', null, ['class = forecasts']);

        const condition = dataCurrent.forecast.condition;
        const firstSpan = createEl('span', weather[condition], ['class = condition symbol']);
        const secondSpan = createEl('span', null, ['class = condition']);

        const innerSpanFirst = createEl('span', dataCurrent.name, ['class = forecast-data']);
        const innerSpanSecond = createEl('span', `${dataCurrent.forecast.low}${weather.Degrees}/${dataCurrent.forecast.high}${weather.Degrees}`, ['class = forecast-data']);
        const innerSpanThird = createEl('span', dataCurrent.forecast.condition, ['class = forecast-data']);

        secondSpan.appendChild(innerSpanFirst);
        secondSpan.appendChild(innerSpanSecond);
        secondSpan.appendChild(innerSpanThird);

        divForecast.appendChild(firstSpan);
        divForecast.appendChild(secondSpan);

        currentDiv.appendChild(divForecast);

        const urlUpcoming = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;
        const dataUpcoming = await makeRequest(urlUpcoming);

        const secondDivWithLabel = createEl('div', 'Current conditions', ['class = label']);
        currentDiv.appendChild(secondDivWithLabel);

        const divForecastInfo = createEl('div', null, ['class = forecast-info']);

        dataUpcoming.forecast.forEach(e => {
            const condition = e.condition;

            createDay(divForecastInfo, upcomingSpan, e);
        });
        forecast.setAttribute('style', 'display:block');
    });

    function createDay(div, upcomingSpan, data) {

        const span = createEl('span', null, ['class = upcoming']);

        const innerSpanFirst = createEl('span', weather[data.condition], ['class = symbol']);
        const innerSpanSecond = createEl('span', `${data.low}${weather.Degrees}/${data.high}${weather.Degrees}`, ['class = forecast-data']);
        const innerSpanThird = createEl('span', data.condition, ['class = forecast-data']);

        span.appendChild(innerSpanFirst);
        span.appendChild(innerSpanSecond);
        span.appendChild(innerSpanThird);

        div.appendChild(span);

        upcomingSpan.appendChild(div);
    }

    async function makeRequest(url) {
        try {
            const response = await fetch(url);
            if (response.ok == false) {
                throw new Error('Error');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            forecast.textContent = 'Error';
        }
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

attachEvents();