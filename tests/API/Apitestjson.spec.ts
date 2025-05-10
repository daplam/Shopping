import test, { BrowserContext } from "@playwright/test";
import POManager from "../../src/pageObjects/POManager";
import UtilsUI from "../../src/utils/utilsUI";
import { TOPOPTIONS } from "../../src/constants/constants";

let webContext: BrowserContext // global variable to be accesible in all file

test.beforeAll(async ({ browser }) => {

    // Used when there are several keys on the storage or there are several data saved in different places

    //create context and new page
    const context = await browser.newContext() // create context
    const page = await context.newPage() // create page
    const utils = new UtilsUI(page)

    const loginMail = 'starwayheavengod@gmail.com'
    const password = 'Alejandro.123'

    //Make login
    await utils.navigateTo()
    await utils.userLogin({ email: loginMail, password: password }) // normal login
    await context.storageState({ path: 'state.json' }) //create the file with the storage state info with the previous login and context // this is at context level
    // method storageState () // it captures all the data that see in the logs (storage, cookies, tokens, etc)
    // storageState({ path: 'state.json' }) -- pass the path to store the file, in this case json file
    webContext = await browser.newContext({ storageState: 'state.json' }) // create a new context with the json file that contains all the login storage.
    await context.close() // close first browser, the one used to generate the json file
})

test('@API TC01 - Creating webbrowser context with json', async () => {

    const pagewithjson = await webContext.newPage() // create a new page using the context with the session storage data injected with the json file

    const poManager = new POManager(pagewithjson) // pass the page with injected using the context with injected json
    const utils = new UtilsUI(pagewithjson)

    await pagewithjson.goto('https://rahulshettyacademy.com/client');

    const dashboardPage = poManager.getDashboardPage()
    const myCartPage = poManager.getMyCartPage()
    const thankYouPage = poManager.getThankYouPage()
    const yourOrdersPage = poManager.getYourOrdersPage()
    const productName = 'ZARA COAT 3'
    const productName2 = 'ADIDAS ORIGINAL'
    await dashboardPage.addProduct({ productName: productName })
    await dashboardPage.addProduct({ productName: productName2 })
    await utils.selectTopMenuOption({ option: TOPOPTIONS.CART })
    await myCartPage.clickCheckout()
    const ccard = '4542 9931 9292 2293'

    await utils.completePayment({ cardNo: ccard, cvv: '123', expireMonth: '06', expireYear: '25', cardName: 'Daniel', country: 'India' })

    let orders = await thankYouPage.getOrdersId()
    await utils.selectTopMenuOption({ option: TOPOPTIONS.ORDERS })
    await yourOrdersPage.verifyOrder({ orderId: orders })
});

