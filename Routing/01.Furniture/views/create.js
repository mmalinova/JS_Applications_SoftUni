import { html } from '../node_modules/lit-html/lit-html.js';
import { createFurniture } from '../api/data.js';

const createTempl = (onSubmit, invalidMake, invalidModel, invalidYear, invalidDesc, invalidPrice, invalisImage) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Create New Furniture</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class=${'form-control' + (invalidMake ? ' is-invalid' : '')} id="new-make" type="text"
                    name="make">
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class=${'form-control' + (invalidModel ? ' is-invalid' : '')} id="new-model" type="text"
                    name="model">
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class=${'form-control' + (invalidYear ? ' is-invalid' : '')} id="new-year" type="number"
                    name="year">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class=${'form-control' + (invalidDesc ? ' is-invalid' : '')} id="new-description" type="text"
                    name="description">
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class=${'form-control' + (invalidPrice ? ' is-invalid' : '')} id="new-price" type="number"
                    name="price">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class=${'form-control' + (invalisImage ? ' is-invalid' : '')} id="new-image" type="text"
                    name="img">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control" id="new-material" type="text" name="material">
            </div>
            <input type="submit" class="btn btn-primary" value="Create"/>
        </div>
    </div>
</form>`;

export async function createPage(ctx) {
    ctx.render(createTempl(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const make = formData.get('make');
        const model = formData.get('model');
        const year = Number(formData.get('year'));
        const description = formData.get('description');
        const price = Number(formData.get('price'));
        const image = formData.get('img');
        const material = formData.get('material');

        if (make.length < 4) {
            ctx.render(createTempl(onSubmit, true, false, false, false, false, false));
            return alert('Make must be at least 4 symbols long');
        }
        if (model.length < 4) {
            ctx.render(createTempl(onSubmit, false, true, false, false, false, false));
            return alert('Model must be at least 4 symbols long');
        }
        if (year < 1950 || year > 2050) {
            ctx.render(createTempl(onSubmit, false, false, true, false, false, false));
            return alert('Year must be between 1950 and 2050');
        }
        if (description.length < 11) {
            ctx.render(createTempl(onSubmit, false, false, false, true, false, false));
            return alert('Description must be more than 10 symbols');
        }
        if (price < 0) {
            ctx.render(createTempl(onSubmit, false, false, false, false, true, false));
            return alert('Price must be a positive number');
        }
        if (image == '') {
            ctx.render(createTempl(onSubmit, false, false, false, false, false, true));
            return alert('Image URL is required');
        }

        const data = {
            make,
            model,
            year,
            description,
            price,
            img: image,
            material: material ? material : ''
        };
        await createFurniture(data);

        ctx.page.redirect('/');
    }
}