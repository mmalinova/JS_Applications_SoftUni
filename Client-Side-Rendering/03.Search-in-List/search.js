import { towns as array } from './towns.js';
import { html, render } from '../node_modules/lit-html/lit-html.js';

const div = document.querySelector('#towns');

function search() {
   let towns = array;
   const template = createTemplate(towns);
   render(template, div);

   document.querySelector('button').addEventListener('click', onClick);
}

function createTemplate(towns, match) {
   return html`
   <ul>
      ${towns.map(town => html`
      <li class=${match && (town.toLowerCase().includes(match.toLowerCase()) ? 'active' : '' )}>${town}</li>`)}
   </ul>`;
}

function onClick(event) {
   const input = document.querySelector('#searchText').value;
   if (!input) {
      return alert('Please, enter input!');
   }

   let towns = array;
   render(createTemplate(towns, input), div);
   document.querySelector('#searchText').value = '';

   const count = towns.filter(town => town.toLowerCase().includes(input.toLowerCase())).length;
   document.querySelector('#result').textContent = count + ' matches found';
}

search();