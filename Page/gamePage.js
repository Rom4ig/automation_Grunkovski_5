const MainPage = require('./mainPage');
const PageBase = require('./page');
const { By } = require('selenium-webdriver');
const regexCost = /\$([0-9]{1,2}.[0-9]{1,2}) USD/;
const regexDiscount = /-([0-9]{1,2})%/;

class GamePage extends PageBase {
    chekage = "agegate_birthday_selector";
    findGame = "game_purchase_action_bg";
    validYear = "ageYear";
    option = "option";
    gameIMG = "game_header_image_full";
    buttonOpen = "btnv6_blue_hoverfade btn_medium";
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

    async find(regex) {
        MainPage.logger.debug(`Find something. Param: regex. Return: max`);
        let discount;
        let arrDiscount = [];
        let res = await MainPage.driver.findElements(By.className(this.findGame));
        for (let link of res) {
            let text = await link.getText();
            MainPage.logger.trace(text);
            discount = await text.match(regex);
            if (discount !== null) {
                MainPage.logger.trace(`We find ${discount[1]} discount/price`);
                arrDiscount.push(discount[1])
                return discount[1];
            }
        }
        MainPage.logger.trace(arrDiscount);
        if (arrDiscount.length === 0) {
            return 0;
        }
        let maxDiscount = Math.max.apply(null, arrDiscount);
        MainPage.logger.trace(`${maxDiscount} - max`);
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

}

module.exports = new GamePage();