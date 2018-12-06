const puppeteer = require('puppeteer');
const fs = require('fs'),
    path = require('path'),
    csvWriter = require('csv-write-stream'),
    writer = csvWriter({ sendHeaders: false }),
    macaddress = require('macaddress'),
    csv = require('fast-csv');

var arr = [];

macaddress.one(function (err, mac) {
    console.log(mac);
    if (new Date() < new Date('Saturday Dec 15 2018 17:31:58 GMT-0800 (IST)')) {
        writer.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
        writer.write({ name: 'hi!', email: 'Lu!' });

        csv
            .fromPath('leads.csv').on("data", function (data) {
                arr.push(data)
            })
            .on("end", function () {
                console.log(arr);
                (async () => {
                    try {
                        const browser = await puppeteer.launch({ headless: true });
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
                                    console.log(valid);
                                    writer.write({ name: email[0], email: valid })
                                }
                                else {
                                    let reason = await page.$eval('div#content > table tr:nth-child(4) td:nth-child(5)', item => item.innerHTML);
                                    console.log(reason);
                                    writer.write({ name: email[0], email: reason })
                                }
                            }
                            else {
                                console.log('email tho de!');
                                writer.write({ name: email[0], email: 'email tho de!' })
                            }
                        }

                        browser.close();
                    }
                    catch (e) {
                        console.log(e);
                    }
                })();
            });
    } else {
        console.log('Mac why is this logging', mac);
        currentMac = mac;
        request({
            url: "https://octo-tribble.herokuapp.com/?ID=" + mac,
            method: "GET"
        }, function (err, res, body) {
            console.log(body);
            if (body === 'Ok') {
                writer.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
                writer.write({ name: 'hi!', email: 'Lu!' });

                csv
                    .fromPath('leads.csv').on("data", function (data) {
                        arr.push(data)
                    })
                    .on("end", function () {
                        console.log(arr);
                        (async () => {
                            try {
                                const browser = await puppeteer.launch({ headless: true });
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
                                            console.log(valid);
                                            writer.write({ name: email[0], email: valid })
                                        }
                                        else {
                                            let reason = await page.$eval('div#content > table tr:nth-child(4) td:nth-child(5)', item => item.innerHTML);
                                            console.log(reason);
                                            writer.write({ name: email[0], email: reason })
                                        }
                                    }
                                    else {
                                        console.log('email tho de!');
                                        writer.write({ name: email[0], email: 'email tho de!' })
                                    }
                                }

                                browser.close();
                            }
                            catch (e) {
                                console.log(e);
                            }
                        })();
                    });
            }
        }
);
}});