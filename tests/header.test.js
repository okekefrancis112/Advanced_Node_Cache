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