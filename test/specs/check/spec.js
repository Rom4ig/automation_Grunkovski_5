const config = require('../../../config');
const logger = config.logger;
const Page = require('../../../Page/page')
const assert = require('assert').strict;

describe('Android', function () {
  it('Headers', async () => {
    logger.info('Start describe');
    //android = new UiSelector().description(“Go To Seller Filter”).childSelector(textContains(“Seller”))

    //const log = 'new UiSelector().className("android.view.ViewGroup").index(1)'
    //const login = $(`android=${log}`)
    await Page.click(config.logo, 5);
    await Page.click(config.QA1Button);
    await Page.back();
    await Page.click(config.loginButton);
    await Page.setCreeds(config.name, 11);
    await Page.setCreeds(config.pass, 13);
    await Page.click(config.submit);
    const err = await Page.getError(config.error);
    expect(err).toContain(config.errors);
    logger.info('End describe');
  });

});
