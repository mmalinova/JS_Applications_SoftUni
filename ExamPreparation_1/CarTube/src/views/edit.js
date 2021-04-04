import { html } from '../../node_modules/lit-html/lit-html.js';
import { getCarById, editCarById } from '../api/data.js';

const editTempl = (car, onSubmit) => html`
<section id="edit-listing">
    <div class="container">

        <form @submit=${onSubmit} id="edit-form">
            <h1>Edit Car Listing</h1>
            <p>Please fill in this form to edit an listing.</p>
            <hr>

            <p>Car Brand</p>
            <input type="text" placeholder="Enter Car Brand" name="brand" .value=${car.brand}>

            <p>Car Model</p>
            <input type="text" placeholder="Enter Car Model" name="model" .value=${car.model}>

            <p>Description</p>
            <input type="text" placeholder="Enter Description" name="description" .value=${car.description}>

            <p>Car Year</p>
            <input type="number" placeholder="Enter Car Year" name="year" .value=${car.year}>

            <p>Car Image</p>
            <input type="text" placeholder="Enter Car Image" name="imageUrl" .value=${car.imageUrl}>

            <p>Car Price</p>
            <input type="number" placeholder="Enter Car Price" name="price" .value=${car.price}>

            <hr>
            <input type="submit" class="registerbtn" value="Edit Listing">
        </form>
    </div>
</section>`;

export async function editPage(ctx) {
    const car = await getCarById(ctx.params.id);

    ctx.render(editTempl(car, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const brand = formData.get('brand');
        const model = formData.get('model');
        const description = formData.get('description');
        const year = Number(formData.get('year'));
        const imageUrl = formData.get('imageUrl');
        const price = Number(formData.get('price'));

        if (!brand || !model || !description || !year || !imageUrl || !price) {
            return alert('All fields are recuired!');
        }
        if (price < 0) {
            return alert('Price must be a positive number!');
        }
        if (year < 0) {
            return alert('Year must be a positive number!');
        }
        const data = {
            brand,
            model,
            description,
            year,
            imageUrl,
            price
        };
        await editCarById(car._id, data);
        event.target.reset();

        ctx.page.redirect('/details/' + car._id);
    }
}