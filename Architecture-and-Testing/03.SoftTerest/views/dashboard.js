import { html, render } from '../node_modules/lit-html/lit-html.js';
import { getIdeas } from '../src/api/data.js';

function createPreviewIdea(idea) {
    return html`
    <div class="card overflow-hidden current-card details" style="width: 20rem; height: 18rem;">
        <div class="card-body">
            <p class="card-text">${idea.title}</p>
        </div>
        <img class="card-image" src="${idea.img}" alt="Card image cap">
        <a id="${idea._id}" class="btn" href="">Details</a>
    </div>`;
}

export function setupDashboard(section, navigation) {
    section.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn')) {
            event.preventDefault();
            const ideaId = event.target.id;
            navigation.goTo('details', ideaId);
        }
    });
    
    return showDashboard;

    async function showDashboard() {
        //section.innerHTML = 'Loading...';
        const ideas = await getIdeas();

        if (ideas.length < 1) {
            render(html`<h1>No ideas yet! Be the first one :)</h1>`, section);
        } else {
            let result = ideas.map(createPreviewIdea);
            render(result, section);
        }

        return section;
    }
}