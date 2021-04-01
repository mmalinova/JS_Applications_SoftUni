import { html } from '../../node_modules/lit-html/lit-html.js';
import { getMemeById, deleteMemeById } from '../api/data.js';

const detailsTemp = (meme, isOwner, onDelete) => html`
<section id="meme-details">
    <h1>Meme Title: ${meme.title}
    </h1>
    <div class="meme-details">
        <div class="meme-img">
            <img alt="meme-alt" src=${meme.imageUrl}>
        </div>
        <div class="meme-description">
            <h2>Meme Description</h2>
            <p>
                ${meme.description}
            </p>

            <!-- Buttons Edit/Delete should be displayed only for creator of this meme  -->
            ${isOwner ? html`<a class="button warning" href="/edit/${meme._id}">Edit</a>
            <button @click=${onDelete} class="button danger">Delete</button>` : ''}
            
        </div>
    </div>
</section>`;

export async function detailsPage(ctx) {
    const meme = await getMemeById(ctx.params.id);

    const isOwner = sessionStorage.getItem('userId') == meme._ownerId;
    ctx.render(detailsTemp(meme, isOwner, onDelete));

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this meme?');
        if (confirmed) {
            await deleteMemeById(meme._id);

            ctx.page.redirect('/dashboard');
        }
    }
}