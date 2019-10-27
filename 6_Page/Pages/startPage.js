const Page = require('./Pages');
const { Key, By, until } = require('selenium-webdriver');

let driver;

class SearchPage extends Page {

    //get nextBtn() { return  $('#pnnext') }

    default(drv) {
        driver = drv;
    }

    open() {
        super.open("https://www.google.com", driver);
    }

    async search(search) {
        let res = await driver.findElement(By.className('gLFyf gsfi'));
        await res.sendKeys(search);
        await res.sendKeys(Key.ENTER);
    }

    async check(classN) {
        return await driver.findElements(By.className(classN));
    }

    async next() {
        await driver.findElement(By.id('pnnext')).then(element =>
            element.click());
        //this.nextBtn.click();
    }

    async results() {
        let element = await driver.wait(until.elementLocated(By.id('resultStats')));
        let found = await element.getText();
        let regex = /(([0-9]+\s*)+)/;
        let num = found.match(regex)[1];
        num = num.replace(' ', '');
        let count = parseInt(num);
        return count;
    }
}
module.exports = new SearchPage();