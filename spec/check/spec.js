require('chromedriver');
require('geckodriver');
const Google = require('../../Pages/startPage');
const config = require('../../Config/config');
const des = 'Gmail';
const firstIT = `Messages with subject ${config.search}`;
const secondIT = `Check. Count of results = ${config.res}`;
let logger = config.logger;


describe(des, () => {
  logger.info(`Start ${des}`);
  beforeAll(async () => {
      await Google.authorize(config.search);
  });
  it(firstIT, (done) => {
      logger.info(`Start ${firstIT}`);
      setTimeout(async () => {
          let countOfMessages = await Google.getCountOfMessages();
          expect(countOfMessages).toBeGreaterThan(0);
          done();
      }, 2000);
      logger.info(`End ${firstIT}`);
  })
  it(secondIT, (done) => {
      logger.info(`Start ${secondIT}`);
      setTimeout(async () => {
          let countOfMessages = await Google.getCountOfMessages();
          expect(countOfMessages).toEqual(config.res);
          logger.info('Getting the content of letters')
          await Google.getBody();
          done();
      }, 2000);
      logger.info(`End ${secondIT}`);
  })
  logger.info(`End ${des}`);
})