import { getIdeaById, deleteIdeaById } from '../src/api/data.js';
import { html, render } from '../node_modules/lit-html/lit-html.js';

function createIdeaDetails(idea, goTo) {
    return html`
    <img class="det-img" src="${idea.img}" />
    <div class="desc">
        <h2 class="display-5">${idea.title}</h2>
        <p class="infoType">Description:</p>
        <p class="idea-description">${idea.description}</p>
    </div>
    ${sessionStorage.getItem('userId') == idea._ownerId ? html`<div class="text-center">
        <a @click=${onDelete} class="btn detb" href="">Delete</a>
    </div>`: html``}
`;

    async function onDelete(event) {
        event.preventDefault();
        const confirmed = confirm('Are you sure you want to delte this idea?');

        if (confirmed) {
            await deleteIdeaById(idea._id);
            goTo('dashboard');
        }
    }
}

export function setupDetails(section, navigation) {
    return showDetails;

    async function showDetails(id) {
        const idea = await getIdeaById(id);
        const details = createIdeaDetails(idea, navigation.goTo);

        render(details, section);

        return section;
    }
}