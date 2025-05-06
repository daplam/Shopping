import test, { Browser, chromium, expect } from "@playwright/test";
import POManager from "../../src/pageObjects/POManager";
import UtilsUI from "../../src/utils/utilsUI";

test.beforeEach(async ({ page }) => {
    const utils = new UtilsUI(page)
    await utils.navigateTo()
})

test.describe('Login Scenarios', () => {
    //test.describe.configure({ mode: 'parallel' }) // to override the setup workers on playwright.config

    test('TC01 - Login successfully', async ({ page }) => {

        //const poManager = new POManager(page)
        //const loginPage = poManager.getLoginPage()
        const utils = new UtilsUI(page)

        //await utils.userLogin({ email: dataset.username, password: dataset.password })
        //console.log(dataset.username)
        await utils.loginByScenario({ scenario: 'SuccessLogin' })
    });

    test('TC02 - Missing password', async ({ page }) => {
        const utils = new UtilsUI(page)
        // const loginMail = 'starwayheavengod@gmail.com'
        //const password = ''
        await utils.loginByScenario({ scenario: 'MissingPassword' })

        //await utils.incorrectLogin({ email: loginMail, password: password })

    });

    test('TC03 - Missing Email', async ({ page }) => {
        const utils = new UtilsUI(page)

        const loginMail = ''
        const password = 'Alejandro.123'

        //await utils.incorrectLogin({ email: loginMail, password: password })
        await utils.loginByScenario({ scenario: 'MissingUsername' })


    });

    test('TC04 - Missing username and password', async ({ page }) => {

        const utils = new UtilsUI(page)
        //const loginMail = 'test@test.com'
        //const password = 'test'

        //await utils.incorrectLogin({ email: loginMail, password: password })
        await utils.loginByScenario({ scenario: 'MissingCredentials' })
    })
})