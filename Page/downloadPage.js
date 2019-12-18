const Page = require('./mainPage');
const PageB = require('./page');
const { By } = require('selenium-webdriver');
const fs = require('fs')
const path = require('path')

class DownloadPage extends PageB {
    downloadFile = "about_install_steam_link";
    async download() {
        await Page.logger.trace('Find and click download');
        let elem = Page.driver.findElement(By.className(this.downloadFile));
        await elem.click();
        await Page.logger.trace('Clicked download');

    }

    async open(text) {
        await Page.logger.trace('Start open download page');
        await Page.chooseCategory("Поддержка", text);
        await Page.logger.trace('Opened');

    }

    async waitForFile(dir, file) {
        await Page.logger.trace('Start find');
        let find = false;
        while (!find) {
            let files = fs.readdirSync(dir);
            for (let i = 0; i < files.length; i++) {
                let filename = path.join(dir, files[i]);
                Page.logger.trace(filename);
                if (filename.endsWith(`.crdownload`)) {
                    find = false;
                }
                else if (filename.includes(file)) {
                    find = true;
                }
            }
        }
        await Page.logger.trace('Found');
        return find;

    }
    
}
module.exports = new DownloadPage();