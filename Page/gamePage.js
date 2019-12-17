const Page = require('./mainPage');
const PageB = require('./page');
const { By } = require('selenium-webdriver');
const regexCost = /\$([0-9]{1,2}.[0-9]{1,2}) USD/;
const regexDiscount = /-([0-9]{1,2})%/;
class GamePage extends PageB {
    chekage = "agegate_birthday_selector";
    findGame = "game_purchase_action_bg";
    validYear = "ageYear";
    option = "option";
    gameIMG = "game_header_image_full";
    buttonOpen = "btnv6_blue_hoverfade btn_medium";
    async isAge() {
        try {
            await Page.driver.findElement(By.className(this.chekage));
        }
        catch (e) {
            Page.logger.trace("Can't find age validator");
            return false;
        }
        return true;
    }
    async find(regex) {
        Page.logger.debug(`Find something. Param: regex. Return: max`);
        let discount;
        let arrDiscount = [];
        let res = await Page.driver.findElements(By.className(this.findGame));
        for (let link of res) {
            let text = await link.getText();
            Page.logger.trace(text);
            discount = await text.match(regex);
            if (discount !== null) {
                Page.logger.trace(`We find ${discount[1]} discount/price`);
                arrDiscount.push(discount[1])
                return discount[1];
            }
        }
        Page.logger.trace(arrDiscount);
        if (arrDiscount.length === 0) {
            return 0;
        }
        let maxDiscount = Math.max.apply(null, arrDiscount);
        Page.logger.trace(`${maxDiscount} - max`);
        return maxDiscount;
    }
    async findMaxPrice() {
        let price = await this.find(regexCost);
        return price;
    }
    async findDiscount() {
        let discount = await this.find(regexDiscount);
        return discount;
    }
    async setValid(year) {
        Page.logger.trace(`Set valid`);
        let age = await Page.driver.findElement(By.id(this.validYear));
        await age.click();
        let selectElem = await Page.driver.findElements(By.tagName(this.option));
        for (let link of selectElem) {
            let text = await link.getText();
            Page.logger.trace(text);
            if (text === year) {
                await link.click();
                break;
            }
        }
        Page.logger.trace(`Seted valid`);
        await Page.driver.findElement(By.className(this.buttonOpen)).click();
        await this.waitElem(this.gameIMG)
        Page.logger.trace(`Opened`);
    }
    async waitElem(find) {
        Page.logger.trace(`Wait Elem ${find}`)
        let wait = true;
        while (wait) {
            try {
                await Page.driver.findElement(By.className(find))
                Page.logger.trace('Founded');
                wait = false;
            }
            catch (e) {
                Page.logger.trace('Not found');
            }
        }
    }
}
module.exports = new GamePage();