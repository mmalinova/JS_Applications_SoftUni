import { html } from '../../node_modules/lit-html/lit-html.js';
import { getArticles } from '../api/data.js';

const dashboardTempl = (articles) => html`
<section id="catalog-page" class="content catalogue">
    <h1>All Articles</h1>

    ${articles.length > 0 ? articles.map(article => articleTempl(article)) : html`<h3 class="no-articles">No articles yet</h3>`}
    <!-- No articles message -->
    
</section>`;

const articleTempl = (article) => html`
<a class="article-preview" href="/details/${article._id}">
    <article>
        <h3>Topic: <span>${article.title}</span></h3>
        <p>Category: <span>${article.category}</span></p>
    </article>
</a>`;

export async function dashboardPage(ctx) {
    const articles = await getArticles();

    ctx.render(dashboardTempl(articles));
}