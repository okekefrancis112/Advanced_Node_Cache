const puppeteer = require("puppeteer");
const sessionFacory = require('./factories/sessionFactory');

let browser, page;
beforeEach( 'We can launch a browser', async () => {
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage();
    await page.goto("localhost:3000");
})

afterEach( async () => {
    await browser.close();
})

test('the header has the correct text', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual("Blogster");
});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a')
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, shows logout button', async () => {

    const { session, sig } = sessionFactory();

    console.log(session, sig);
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});