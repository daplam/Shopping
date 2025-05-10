import { After, AfterStep, Before, BeforeStep, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import POManager from "../../src/pageObjects/POManager";

setDefaultTimeout(30 * 1000);

Before(async function () {

    this.browser = await chromium.launch({ headless: true });
    let context = await this.browser.newContext()
    this.page = await context.newPage()
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