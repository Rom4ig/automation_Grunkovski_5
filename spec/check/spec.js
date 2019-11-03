require('chromedriver');
require('geckodriver');
const StartPage = require('../../Pages/startPage');
const config = require('../../config');
const { Builder } = require('selenium-webdriver');
let browser = 'chrome';
if (process.argv.length > 2) { //Check browser
  let regex = /--browser=([A-Za-z]+)/;
  browser = process.argv[2].match(regex)[1];
}
const driver = new Builder().forBrowser(browser).build();
let start;
let count = 0;
const des = 'Google';
const firstIT = 'Headers';
const secondIT = 'Count of results';
let logger = config.logger;
beforeAll(async function (done) {
  StartPage.clear();
  StartPage.default(driver, logger)
  StartPage.open();
  await StartPage.search(config.search);
  start = new Date();
  done();
}, 15000);

afterAll(async function () {
  await driver.quit();
  logger.info(`Results: ${count}`);
  logger.info(`Time: ${new Date() - start}ms`);
}, 15000);

describe(des, function () {
  logger.info(`Start describe ${des}`);
  it(firstIT, async function (done) { //check pages
    logger.info(`Start it ${firstIT}`);
    let i = await StartPage.check('rc');
    for (let link of i) {
      let text = await link.getText();
      expect(text.toLowerCase()).toContain(config.search.toLowerCase())
    }
    await StartPage.next(); //next page
    i = await StartPage.check('rc');
    for (let link of i) {
      let text = await link.getText();
      expect(text.toLowerCase()).toContain(config.search.toLowerCase())
    }
    done();
    logger.info(`End it ${firstIT}`);
  }, 15000);

  it(secondIT, async function (done) { //Check count of results
    logger.info(`Start it ${secondIT}`);
    count = await StartPage.results();
    expect(count).toBeGreaterThan(config.res);
    done();
    logger.info(`End it ${secondIT}`);
  }, 10000);
  logger.info(`End describe ${des}`);
});