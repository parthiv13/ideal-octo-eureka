const puppeteer = require('puppeteer');
const fs = require('fs'),
    path = require('path'),
    csv = require('fast-csv');

var arr = [];

csv
    .fromPath('leads.csv').on("data", function (data) {
        arr.push(data)
    })
    .on("end", function () {
        console.log(arr);
        (async () => {
            try {
                const browser = await puppeteer.launch({ headless: false });
                const page = await browser.newPage();

                for (let email of arr) {
                    await page.goto('http://mailtester.com/');
                    //console.log('starting');
                    if (typeof email[0] != 'undefined') {
                        await page.type('input[name=email]', email[0], { delay: 1 });
                        await page.click('input[type=submit]');
                        console.log(email[0]);
                        await page.waitForSelector('table');

                        let title = await page.$$eval('div#content > table tr', item => item.length);
                        if (title == 5) {
                            let valid = await page.$eval('div#content > table tr:nth-child(5) td:nth-child(5)', item => item.innerHTML);
                            console.log(valid)
                        }
                        else {
                            console.log("server refused to connect")
                        }
                    }
                    else {
                        console.log('email tho de!')
                    }
                }

                browser.close();
            }
            catch (e) {
                console.log(e);
            }
        })();
    });



/*let scrape = async (email) => {
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

scrape().then((value) => {
    console.log(value);
})

/*csv
    .fromPath('leads.csv').on("data", function (data) {
        if (data != "")
            scrape(data)
                .then((value) => {
                    console.log(value)
                })
                .catch((error) => {
                    //console.log(error)
                })
    })
    .on("end", function () {
        console.log('done')
    })*/