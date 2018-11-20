const puppeteer = require('puppeteer');
const fs = require('fs'),
    path = require('path'),
    csv = require('fast-csv');

let scrape = async (email) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('http://mailtester.com/');
    await page.type('input[name=email]', email, { delay: 20 });
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

/*scrape().then((value) => {
    console.log(value);
})*/

csv
    .fromPath('leads.csv').on("data", function (data) {
        if (data != "")
            scrape(data).then((value) => {
                console.log(value)
            })
    })
    .on("end", function () {
        console.log('done')
    })