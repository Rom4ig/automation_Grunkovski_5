const config = require('../config');
const logger = config.logger;

class Page {

    async click(selector, count) {
        let element = await $(selector);
        if (count === undefined) {
            count = 1;
        }
        else {
            logger.trace(`Click: ${selector} ${count} times`);
            for (let i = 0; i < count; i++)
                await element.click();
        }
    }

    async back() {
        logger.trace('Back page');
        driver.back();
    }


    async setCreeds(selector, length) {
        logger.trace(`Random creeds ${selector}`);
        let creed = await $(`android=new UiSelector().resourceId("${selector}")`);
        await creed.setValue(this.getRandom(length));
    }

    async getError(selector) {
        logger.trace('Error');
        let err = await $(selector);
        return await err.getText();
    }

    getRandom(i) {
        var rnd = '';
        while (rnd.length < i)
            rnd += Math.random().toString(36).substring(2);
        return rnd.substring(0, i);
    }

}

module.exports = new Page();
