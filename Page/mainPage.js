const Page = require('./page');
const { By } = require('selenium-webdriver');
const fs = require('fs');
const regexCost = /[0-9]\n\$([0-9]{1,2}.[0-9]{1,2})/;
const regexMax = /\$([0-9]{1,2}.[0-9]{1,2})/;
const regexDiscount = /-([0-9]{1,2})%/;
class StartPage extends Page {
    driver;
    logger;
    price = "discount_block tab_item_discount";
    default(drv, logg) {
        this.driver = drv;
        this.logger = logg;
        this.logger.debug(`Set driver and logger. Param: driver and logger. Return: void`);
    }

    open(site) {
        this.logger.debug(`Open steam page. Param: none. Return: void`);
        super.open(site, this.driver);
    }

    async chooseCategory(search1, search2) {
        this.logger.debug(`Seach category ${search2}. Param: search string. Return: void`);
        let menu = await this.driver.findElement(By.linkText(search1));
        const actions = this.driver.actions({ bridge: true });
        await actions.move({ duration: 200, origin: menu, x: 0, y: 0 }).perform();
        let res = await this.driver.findElement(By.linkText(search2));
        await res.click();
        this.logger.debug(`Clicked ${search2}`);
    }

    async find(regex) {
        this.logger.debug(`Find something. Param: regex. Return: max`);
        let discount;
        let arrDiscount = [];
        let res = await this.driver.findElements(By.className(this.price));
        for (let link of res) {
            let text = await link.getText();
            this.logger.trace(text);
            discount = await text.match(regex);
            if (discount !== null) {
                this.logger.trace(`We find ${discount[1]}% discount/price`);
                arrDiscount.push(discount[1])
            }
        }
        this.logger.trace(arrDiscount);
        if (arrDiscount.length === 0) {
            return 0;
        }
        let maxDiscount = Math.max.apply(null, arrDiscount);
        this.logger.trace(`${maxDiscount} - max`);
        return maxDiscount;
    }
    async chooseGame(regex, max) {
        let res = await this.driver.findElements(By.className(this.price));
        for (let link of res) {
            let text = await link.getText();
            let discount = await text.match(regex);
            if (discount !== null) {
                this.logger.trace(`SECOND FIND ${discount[1]}`);
                if (discount[1] === String(max)) {
                    await link.click();
                    this.logger.info(`Clicked`);
                    break;
                }
            }
        }
    }
    async findPriceByDiscount(discount) {
        let res = await this.driver.findElements(By.className(this.price));
        for (let link of res) {
            let text = await link.getText();
            let price = await text.match(regexCost);
            let disc = await text.match(regexDiscount);
            if (price !== null && disc !== null) {
                this.logger.trace(`PRICE?? ${price}`);
                if (disc[1] === String(discount)) {
                    this.logger.trace(`Discount =${discount} AND Price = ${price[1]}`);
                    return price[1];
                }
            }
        }
    }
    async findMaxPrice() {
        let maxPrice = await this.find(regexMax);
        return maxPrice;
    }
    async findDiscount() {
        let discount = await this.find(regexDiscount);
        return discount;
    }
    async chooseByDiscount(max) {
        await this.chooseGame(regexDiscount, max);
    }
    async chooseByPrice(max) {
        await this.chooseGame(regexMax, max);
    }
    async clear() {
        fs.writeFileSync('./logs/debug.log', "");
    }
}
module.exports = new StartPage();