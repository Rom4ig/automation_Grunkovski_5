require('chromedriver');
require('geckodriver');
const StartPage = require('../../Page/mainPage');
const GamePage = require('../../Page/gamePage');
const DownloadPage = require('../../Page/downloadPage');
const config = require('../../config');
const { Builder, By, WebDriver } = require('selenium-webdriver');
let browser = 'chrome';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 45000;
if (process.argv.length > 2) { //Check browser
  let regex = /--browser=([A-Za-z]+)/;
  browser = process.argv[2].match(regex)[1];
}
const driver = new Builder().forBrowser(browser).build();
let start;
let logger = config.logger;
beforeAll(async function (done) {
  StartPage.default(driver, logger)
  await StartPage.clear();
  await StartPage.open("https://store.steampowered.com/");
  start = new Date();
  done();
});
afterAll(async function () {
  await driver.quit();
  logger.info(`Time: ${new Date() - start}ms`);
});
describe('Any', function () {
  let discount;
  let money;
  logger.info(`Start describe`);
  it('Find discount', async function (done) {
    logger.info(`Start Find discount`);
    await StartPage.chooseCategory('Игры', 'Экшен');
    discount = await StartPage.findDiscount();
    if (discount === 0) {
      let maxPrice = await StartPage.findMaxPrice();
      await StartPage.chooseByPrice(maxPrice);
      expect(maxPrice).toBeGreaterThan(0);
    }
    else {
      money = await StartPage.findPriceByDiscount(discount);
      await StartPage.chooseByDiscount(discount);
      expect(discount).toBeGreaterThan(0);
    }
    done();
    logger.info(`End Find discount`);
  });
  it('Check game', async function (done) {
    logger.info(`Start Check game`);
    if (await GamePage.isAge()) {
      logger.info(`THIS GAME MAY CONTAIN CONTENT NOT APPROPRIATE FOR ALL AGES, OR MAY NOT BE APPROPRIATE FOR VIEWING AT WORK.`);
      await GamePage.setValid("2000");
    }
    logger.info(`Find discount/cost of game`);
    let moneyG = await GamePage.findMaxPrice();
    logger.trace(`MoneyG =${typeof (moneyG)} ${moneyG}`);
    logger.trace(`Money =${typeof (money)} ${money}`);
    expect(moneyG).toEqual(money);
    let discountG = await GamePage.findDiscount();
    logger.trace(`DiscountG = ${typeof (discountG)} ${discountG}`);
    logger.trace(`Discount = ${typeof (discount)} ${discount}`);
    expect(parseInt(discountG)).toEqual(discount);
    done();
    logger.info(`End Check game`);
  });
  it('Download Steam', async function (done) {
    logger.info(`Start IT download steam`);
    await DownloadPage.open('Установить Steam');
    await DownloadPage.download();
    let file = await DownloadPage.waitForFile('C:/Users/romse/Downloads', 'SteamSetup');
    expect(file).toBe(true);
    done();
    logger.info(`End IT download steam`);
  });
});