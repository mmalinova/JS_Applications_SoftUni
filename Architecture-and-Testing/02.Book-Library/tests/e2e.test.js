//@ts-check
const { chromium } = require('playwright-chromium');
const { describe } = require('mocha');
const { assert, expect } = require('chai');

const mockData = require('./mock-data.json');
const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

const endpoints = {
    recipes: '/data/recipes?select=_id%2Cname%2Cimg',
    count: '/data/recipes?count',
    recent: '/data/recipes?select=_id%2Cname%2Cimg&sortBy=_createdOn%20desc',
    recipe_by_id: '/data/recipes/3987279d-0ad4-4afb-8ca9-5b256ae3b298',
    register: '/users/register',
    login: '/users/login',
    logout: '/users/logout',
    create: '/data/recipes'
};


function json(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
}

let browser;
let context;
let page;

describe('E2E tests', function () {
    this.timeout(6000);

    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 500 });
        // browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();

        // block intensive resources and external calls (page routes take precedence)
        await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
        /*
        await context.route(url => {
            return url.hostname != 'localhost';
        }, route => route.abort());
        */
        await context.route('**' + endpoints.count, route => route.fulfill(json(3)));

        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    describe('Load Books', () => {
        it('show Books', async () => {
            page.route('**/jsonstore/collections/books', route => route.fulfill(json(mockData)));

            await page.goto(host);
            await page.click('text=LOAD ALL BOOKS');
            await page.waitForSelector('tbody');
            const books = await page.$eval('tbody', (el) => el.textContent);
            assert.include(books, 'Harry Potter and the Philosopher\'s Stone');
            assert.include(books, 'J.K.Rowling');
            assert.include(books, 'Svetlin Nakov');
        });
    });

    describe('Add book', () => {
        it('add book correct', async () => {

            const author = 'Test';
            const title = 'Test';
            page.route('**/jsonstore/collections/book', route => route.fulfill(json({ author, title })));


            await page.goto(host);
            await page.fill('[name="title"]', title);
            await page.fill('[name="author"]', author);

            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('/jsonstore/collections/book') && request.method() == 'POST'),
                page.click('text=Submit')
            ]);

            const requestData = JSON.parse(request.postData());
            assert.equal(requestData.author, author);
            assert.equal(requestData.title, title);
        });
    });

    describe('Edit book', () => {
        it('edit book correct', async () => {
            const author = 'Test';
            const title = 'Test';
            page.route('**/jsonstore/collections/books', route => route.fulfill(json(mockData)));

            await page.goto(host);
            await page.click('text=LOAD ALL BOOKS');
            await page.waitForSelector('tbody');
            await page.click('text=Edit');
            await page.waitForSelector('#editForm');

            const editForm = await page.$eval('form:visible > h3', (el) => el.textContent);
            assert.equal(editForm, 'Edit FORM');

            await page.fill('form:visible > [name="title"]', title);
            await page.fill('form:visible > [name="author"]', author);

            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('/jsonstore/collections/book') && request.method() == 'PUT'),
                page.click('text=Save')
            ]);

            const requestData = JSON.parse(request.postData());
            assert.equal(requestData.author, author);
            assert.equal(requestData.title, title);
        });
    });


    it('delete book works correctly', async () => {
        await page.goto(host);
 
        await page.click('#loadBooks');
        
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
 
        await page.click('button.deleteBtn');
 
        await page.click('#loadBooks');
 
        const books = await page.$$eval('tbody > tr > td', r => r.map(td => td.textContent));
 
        expect(books[0]).to.equal('C# Fundamentals');
        expect(books[1]).to.equal('Svetlin Nakov');
    });
});
