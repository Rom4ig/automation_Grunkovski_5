const Page = require('./Pages');
const { Key, By, until } = require('selenium-webdriver');
let driver;
let logger;
const fs = require('fs');

class SearchPage extends Page {

    default(drv, logg) {        
        driver = drv;
        logger = logg;
        logger.debug(`Set driver and logger. Param: driver and logger. Return: void`);
    }

    open() {
        logger.debug(`Open page google.com. Param: none. Return: void`);
        super.open("https://www.google.com", driver);
    }

    async search(search) {
        logger.debug(`Seach ${search}. Param: search string. Return: void`);
        let res = await driver.findElement(By.className('gLFyf gsfi'));
        await res.sendKeys(search);
        await res.sendKeys(Key.ENTER);
    }

    async check(classN) {
        logger.debug(`Seach class. Param: class name. Return: elements`);
        return await driver.findElements(By.className(classN));
    }

    async next() {
        logger.debug(`Go to next page. Param: none. Return: void`);
        await driver.findElement(By.id('pnnext')).then(element =>
            element.click());
    }

    async results() {
        logger.debug(`Seach count of results. Param: none. Return: count of results`);
        let element = await driver.wait(until.elementLocated(By.id('resultStats')));
        let found = await element.getText();
        let regex = /(([0-9]+\s*)+)/;
        let num = found.match(regex)[1];
        num = num.replace(' ', '');
        let count = parseInt(num);
        return count;
    }
    async clear()
    {
        fs.writeFileSync('./logs/debug.log', "");
    }
}
module.exports = new SearchPage();