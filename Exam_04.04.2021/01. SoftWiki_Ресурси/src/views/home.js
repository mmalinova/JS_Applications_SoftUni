import { html } from '../../node_modules/lit-html/lit-html.js';
import { getRecent } from '../api/data.js';

const homeTempl = (recents, java, JS, python, cSharp) => html`
<section id="home-page" class="content">
    <h1>Recent Articles</h1>

    ${recents.map(recent => html`
    <section class="recent js">
        <h2>${recent.category}</h2>
        <article>
            <h3>${recent.title}</h3>
            <p>${recent.content}</p>
            <a href="/details/${recent._id}" class="btn details-btn">Details</a>
        </article>
    </section>`)}
    ${java == false ? html`
    <section class="recent js">
        <h2>Java</h2>
        <h3 class="no-articles">No articles yet</h3>
    </section>` : ''}
    ${JS == false ? html`
    <section class="recent js">
        <h2>JavaScript</h2>
        <h3 class="no-articles">No articles yet</h3>
    </section>` : ''}
    ${python == false ? html`
    <section class="recent js">
        <h2>Python</h2>
        <h3 class="no-articles">No articles yet</h3>
    </section>` : ''}
    ${cSharp == false ? html`
    <section class="recent js">
        <h2>C#</h2>
        <h3 class="no-articles">No articles yet</h3>
    </section>` : ''}

</section>`;

export async function homePage(ctx) {
    const recents = await getRecent();

    let java = false;
    let JS = false;
    let python = false;
    let cSharp = false;
    for (let i = 0; i < recents.length; i++) {
        const cat = recents[i].category;
        if (cat == 'Java') {
            java = true;
        }
        if (cat == 'JavaScript') {
            JS = true;
        }
        if (cat == 'Python') {
            python = true;
        }
        if (cat == 'C#') {
            cSharp = true;
        }
    }
    ctx.render(homeTempl(recents, java, JS, python, cSharp));
}