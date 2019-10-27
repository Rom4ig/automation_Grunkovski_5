require('chromedriver');
require('geckodriver');
const StartPage = require('../../Pages/startPage');
const config = require('../../testData.js');
const { Builder } = require('selenium-webdriver');
let browser = 'chrome';
if (process.argv.length > 2) { //Check browser
  let regex = /--browser=([A-Za-z]+)/;
  browser = process.argv[2].match(regex)[1];
}
let driver = new Builder().forBrowser(browser).build();
let start;
let count = 0;


beforeAll(async function (done) {
  StartPage.default(driver) //
  StartPage.open();
  await StartPage.search(config.search);
  start = new Date();
  done();
}, 15000);

afterAll(async function () {
  await driver.quit();
  console.log(`\nResults: ${count}`);
  console.log(`Time: ${new Date() - start}ms`);
}, 15000);

describe('Google', function () {

  it('Headers', async function (done) { //check pages
    console.log('Page1');
    let i = await StartPage.check('rc');
    for (let link of i) {
      let text = await link.getText();
      console.log(text);
      expect(text.toLowerCase()).toContain(config.search.toLowerCase())
    }
    await StartPage.next(); //next page
    console.log('Page2')
    i = await StartPage.check('rc');
    for (let link of i) {
      let text = await link.getText();
      console.log(text);
      expect(text.toLowerCase()).toContain(config.search.toLowerCase())
    }
    done();
  }, 15000);

  it(`Count of results less than ${config.res}`, async function (done) { //Check count of results
    count = await StartPage.results();
    expect(count).toBeGreaterThan(config.res);
    done();
  }, 10000);

});