import { html } from '../../node_modules/lit-html/lit-html.js';
import { searchByTitle } from '../api/data.js';

const searchTempl = (toRender, onSubmit, articles) => html`
<section id="search-page" class="content">
    <h1>Search</h1>
    <form @submit=${onSubmit} id="search-form">
        <p class="field search">
            <input type="text" placeholder="Search by article title" name="search">
        </p>
        <p class="field submit">
            <input class="btn submit" type="submit" value="Search">
        </p>
    </form>

    ${toRender == true ? html`
    <div class="search-container">

        ${articles.length > 0 ? articles.map(article => searchT(article)) : html`<h3 class="no-articles">No matching
            articles</h3>`}

    </div>` : ''}

</section>`;

const searchT = (article) => html`
<a class="article-preview" href="#">
    <article>
        <h3>Topic: <span>${article.title}</span></h3>
        <p>Category: <span>${article.category}</span></p>
    </article>
</a>`;

export async function searchPage(ctx) {
    ctx.render(searchTempl(false, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const title = formData.get('search');

        const articles = await searchByTitle(title);

        ctx.render(searchTempl(true, onSubmit, articles));

    }
}