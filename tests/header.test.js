const puppeteer = require("puppeteer");

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
    const id = '63c511e60587b2e6d903444c';

    const Buffer = require("safe-buffer").Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    }
    const sessionString = Buffer.from(
        JSON.stringify(sessionObject)
    ).toString('base64');

    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    console.log(sessionString, sig);
    await page.setCookie({ name: 'session', value: sessionString });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});