import dotenv from 'dotenv';
dotenv.config();

import { After, AfterStep, Before, BeforeStep, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import POManager from "../../src/pageObjects/POManager"
import { setGlobalSettings } from '../../src/utils/playwright_timeout'

// create a configuration object for easy access to env variables
const config = {
    headless: (process.env.HEADLESS || 'true').trim().toLowerCase() === 'true',
    browserType: (process.env.BROWSER || 'chromium').trim().toLowerCase(),
    downloadsPath: process.env.DOWNLOADS_PATH || './downloads',
    viewport: {
        width: parseInt(process.env.BROWSER_WIDTH || '1280'),
        height: parseInt(process.env.BROWSER_HEIGHT || '720')
    },
};

setDefaultTimeout(30 * 1000);

Before(async function () {

    console.log('HEADLESS mode:', config.headless);
    this.browser = await chromium.launch({ headless: config.headless })
    let context = await this.browser.newContext({
        acceptDownloads: true,
        downloadsPath: config.downloadsPath  //'/Users/Daplam/Downloads/'
    });

    this.page = await context.newPage()
    setGlobalSettings(await this.page) // apply global settings or timeouts to pages when they are created
    await this.page.setViewportSize(config.viewport)
    this.poManager = new POManager(this.page)
})

BeforeStep(function () {

})

After(async function () {

    if (this.page) {
        await this.page.close()
    }

    if (this.browser) {
        await this.browser.close()
    }

})

AfterStep(function ({ result }) {

    if (result.status === Status.FAILED) {

    }

})