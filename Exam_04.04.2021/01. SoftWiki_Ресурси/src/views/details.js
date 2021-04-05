import { html } from '../../node_modules/lit-html/lit-html.js';
import { getArticleById, deleteArticleById } from '../api/data.js';

const detailsTempl = (article, isOwner, onDelete) => html`
<section id="details-page" class="content details">
    <h1>${article.title}</h1>

    <div class="details-content">
        <strong>Published in category ${article.category}</strong>
        <p>${article.content}</p>

        <div class="buttons">
            ${isOwner ? html`<a @click=${onDelete} href="javascript:void(0)" class="btn delete">Delete</a>
            <a href="/edit/${article._id}" class="btn edit">Edit</a>
            <a href="/home" class="btn edit">Back</a>` : html`<a href="/home" class="btn edit">Back</a>`}
        </div>
    </div>
</section>`;

export async function detailsPage(ctx) {
    const article = await getArticleById(ctx.params.id);

    const isOwner = sessionStorage.getItem('userId') == article._ownerId;
    ctx.render(detailsTempl(article, isOwner, onDelete));

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this meme?');
        if (confirmed) {
            await deleteArticleById(article._id);

            ctx.page.redirect('/home');
        }
    }
}