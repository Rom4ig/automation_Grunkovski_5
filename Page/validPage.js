const MainPage = require('./mainPage');
const PageBase = require('./page');
const { By } = require('selenium-webdriver');

class ValidPage extends PageBase {
    validYear = "ageYear";
    chekage = "agegate_birthday_selector";
    option = "option";

    async isAge() {
        try {
            await MainPage.driver.findElement(By.className(this.chekage));
        }
        catch (e) {
            MainPage.logger.trace("Can't find age validator");
            return false;
        }
        return true;
    }

    async setValid(year) {
        MainPage.logger.trace(`Set valid`);
        let age = await MainPage.driver.findElement(By.id(this.validYear));
        await age.click();
        let selectElem = await MainPage.driver.findElements(By.tagName(this.option));
        for (let link of selectElem) {
            let text = await link.getText();
            MainPage.logger.trace(text);
            if (text === year) {
                await link.click();
                break;
            }
        }
        MainPage.logger.trace(`Set valid`);
        await MainPage.driver.findElement(By.className(this.buttonOpen)).click();
        await this.waitElem(this.gameIMG)
        MainPage.logger.trace(`Opened`);
    }

    async waitElem(find) {
        MainPage.logger.trace(`Wait Elem ${find}`)
        let wait = true;
        while (wait) {
            try {
                await MainPage.driver.findElement(By.className(find))
                MainPage.logger.trace('Founded');
                wait = false;
            }
            catch (e) {
                MainPage.logger.trace('Not found');
            }
        }
    }
}


module.exports = new ValidPage();