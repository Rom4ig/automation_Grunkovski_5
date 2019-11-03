let allure = require('allure-commandline');
let generation = allure(['generate', 'allure-results', '--clean']);
let open = require('open');

generation.on('exit', function(exitCode) {
    console.log(`Generation finished with code: ${exitCode}`);
    open('allure-report/index.html');
});
