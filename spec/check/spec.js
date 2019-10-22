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
  it('FP', async function (done) { //check First Page
    console.log('Check1');
    expect(await search()).toBe(true);
    done();
  }, 10000);

  it('SP', async function (done) { //check Second Page
    await driver.wait(until.elementLocated(By.id('pnnext'))); //Go Second Page
    await driver.findElement(By.id('pnnext')).then(element =>
      element.click());
    console.log('Check2');
    expect(await search()).toBe(true);
    done();
  }, 15000);

  it('Results count greater than x', async function (done) { //Check count of results
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
async function search() { //Search for source text in headers
  let count_h3 = 0;
  let count_search = 0;
  let check = false;
  let i = await driver.findElements(By.css("h3.LC20lb")); //Search all headers
  for (let link of i) { //Check headers
    count_h3++;
    let text = await link.getText();
    if (text.toLowerCase().indexOf(config.search.toLowerCase()) !== -1) { count_search++; }
    console.log(text);
  }
  console.log(`=============> ${count_search} and =========> ${count_h3}`)
  if (count_h3 === count_search) { check = true };
  return check;
}
