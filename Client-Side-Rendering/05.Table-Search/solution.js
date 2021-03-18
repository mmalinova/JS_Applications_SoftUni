import { html, render } from '../node_modules/lit-html/lit-html.js';

async function solve() {
   document.querySelector('#searchBtn').addEventListener('click', onClick);

   const data = await getItems();
   let rows = Array.from(Object.values(data)).map(row => createTemplate(row));

   const table = document.querySelector('table>tbody');
   render(rows, table);

   function onClick() {
      const input = document.querySelector('#searchField').value;
      if (!input) {
         return alert('Please, enter input!');
      }
      const result = Array.from(Object.values(data)).map(row => createTemplate(row, input));
      render(result, table);

      document.querySelector('#searchField').value = '';
   }
}

function createTemplate(data, match) {
   return html`
   <tr class=${match && (Object.values(data).map(e => e.toLowerCase()).splice(0, 4)
      .filter(el => el.includes(match.toLowerCase())).length) ? 'select' : ''}>
      <td>${data.firstName} ${data.lastName}</td>
      <td>${data.email}</td>
      <td>${data.course}</td>
   </tr>`;
}

async function getItems() {
   const response = await fetch('http://localhost:3030/jsonstore/advanced/table');
   if (response.ok == false) {
      const error = await response.json();
      alert(error.message);
      throw new Error(error.message);
   }
   return await response.json();
}

solve();