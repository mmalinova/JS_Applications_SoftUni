import { html } from '../../node_modules/lit-html/lit-html.js';
import { getArticleById, editArticleById } from '../api/data.js';

const editTempl = (article, onSubmit) => html`
<section id="edit-page" class="content">
    <h1>Edit Article</h1>

    <form @submit=${onSubmit} id="edit">
        <fieldset>
            <p class="field title">
                <label for="title">Title:</label>
                <input type="text" name="title" id="title" placeholder="Enter article title" .value=${article.title}>
            </p>

            <p class="field category">
                <label for="category">Category:</label>
                <input type="text" name="category" id="category" placeholder="Enter article category" .value=${article.category}>
            </p>
            <p class="field">
                <label for="content">Content:</label>
                <textarea name="content" id="content">${article.content}</textarea>
            </p>

            <p class="field submit">
                <input class="btn submit" type="submit" value="Save Changes">
            </p>

        </fieldset>
    </form>
</section>`;

export async function editPage(ctx) {
    const article = await getArticleById(ctx.params.id);

    ctx.render(editTempl(article, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const title = formData.get('title');
        const category = formData.get('category');
        const content = formData.get('content');

        if (!title || !category || !content) {
            return alert('All fields are recuired!');
        }
        if (category == 'JavaScript' || category == 'C#' || category == 'Java' || category == 'Python') {
            const data = {
                title,
                category,
                content
            };
            await editArticleById(article._id, data);
            event.target.reset();

            ctx.page.redirect('/details/' + article._id);
        } else {
            return alert('Please, enter a valid category!');
        }
    }
}