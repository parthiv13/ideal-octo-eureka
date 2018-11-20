const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch( { headless: true });
    const page = await browser.newPage();

    await page.goto('http://mailtester.com/');
    await page.type('input[name=email]', 'dan.conroy@aksteel.com', {delay: 20});
    await page.click('input[type=submit]');
    await page.waitFor(1000);

    await page.waitForSelector('table');

    const result = await page.evaluate(() => {
        let isValid = document.querySelector('body');
        const random = document.querySelector('div#content > table tr:nth-child(5)').innerText;
        return random;
    });

    browser.close();
    return result;
};

scrape().then((value) => {
    console.log(value);
})