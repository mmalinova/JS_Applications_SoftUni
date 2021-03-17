//@ts-check
const { chromium } = require('playwright-chromium');
const { describe } = require('mocha');
const { assert } = require('chai');

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

    describe('Load Messages', () => {
        it('show messages', async () => {
            page.route('**/jsonstore/messenger', route => route.fulfill(json(mockData)));

            await page.goto(host);
            await page.click('text=Refresh');
            await page.waitForSelector('#messages');
            const messages = await page.$eval('#messages', (el) => el.value);
            assert.include(messages, 'Spami: Hello, are you there?');
            assert.include(messages, 'George: Hello, guys! :))');
        });
    });

    describe('Send Messages', () => {
        it('send message correct', async () => {
            const author = 'Test';
            const content = 'Test';
            page.route('**/jsonstore/messenger', route => route.fulfill(json({ author, content })));

            await page.goto(host);
            await page.fill('[id="author"]', author);
            await page.fill('[id="content"]', content);

            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('/jsonstore/messenger') && request.method() == 'POST'),
                page.click('text=Send')
            ]);

            const requestData = JSON.parse(request.postData());
            assert.equal(requestData.author, author);
            assert.equal(requestData.content, content);
        });
    });
});
