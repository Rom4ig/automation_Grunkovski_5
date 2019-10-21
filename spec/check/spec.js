require('chromedriver');
require('geckodriver');
const config = require('../../testData.js');

const { Builder, By, Key, until } = require('selenium-webdriver');
let driver = new Builder().forBrowser('chrome').build();
let count = 0;
let start;

beforeAll(function (done) {
  driver.get('https://google.com/').then(() => {
    driver.findElement(By.className("gLFyf gsfi")).then(tag => {
      tag.sendKeys(config.search).then(() => {
        tag.sendKeys(Key.ENTER).then(() => {
          done();
        });
      });
    });
  });
  start = new Date();
}, 15000);

afterAll(async function () {
  await driver.quit();
  console.log(`\nResults: ${count}`);
  console.log(`Time: ${new Date() - start}ms`);
}, 15000);

describe('Google', function () {

  it('FP', function (done) {
    driver.getPageSource().then(source => {
      expect(source.toLowerCase().includes(config.search.toLowerCase())).toBe(true);
      done();
    });
  }, 10000);

  it('SP', async function (done) {
    await driver.wait(until.elementLocated(By.id('pnnext')));
    await driver.findElement(By.id('pnnext')).then(element =>
      element.click());
    driver.getPageSource().then(source => {
      expect(source.toLowerCase().includes(config.search.toLowerCase())).toBe(true);
      done();
    });
  }, 10000);

  it('Results count greater than x', async function (done) {
    let element = await driver.wait(until.elementLocated(By.id('resultStats')));
    let found = await element.getText();
    let regex = /(([0-9]+\s*)+)/;
    let num = found.match(regex)[1];
    num = num.replace(' ', '');
    count = parseInt(num);
    expect(count).toBeGreaterThan(config.res);
    done();
  }, 10000);

});