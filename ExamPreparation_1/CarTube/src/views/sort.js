import { html } from '../../node_modules/lit-html/lit-html.js';
import { getCarsByYear } from '../api/data.js';

const searchTempl = (toRender, cars) => html`
<section id="search-cars">
    <h1>Filter by year</h1>

    <div class="container">
        <input id="search-input" type="text" name="search" placeholder="Enter desired production year">
        <button class="button-list">Search</button>
    </div>
    ${toRender == true ? result(cars) : ''}
</section>`;

const result = (cars) => html`
    <h2>Results:</h2>
    <div class="listings">
    
        <!-- Display all records -->
        ${cars.length > 0 ? cars.map(car => carTempl(car)) : html`<p class="no-cars"> No results.</p>`}
        <!-- Display if there are no matches -->
    
    </div>`;

const carTempl = (car) => html`
<div class="listing">
    <div class="preview">
        <img src=${car.imageUrl}>
    </div>
    <h2>${car.brand} ${car.model}</h2>
    <div class="info">
        <div class="data-info">
            <h3>Year: ${car.year}</h3>
            <h3>Price: ${car.price} $</h3>
        </div>
        <div class="data-buttons">
            <a href="/details/${car._id}" class="button-carDetails">Details</a>
        </div>
    </div>
</div>`;

export async function searchByYear(ctx) {
    ctx.render(searchTempl(false));

    const year = document.querySelector('#search-input');
    document.querySelector('.container>button').addEventListener('click', async () => {
        const cars = await getCarsByYear(Number(year.value));

        ctx.render(searchTempl(true, cars));
    });
}