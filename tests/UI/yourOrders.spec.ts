import test from "@playwright/test";
import POManager from "../../src/pageObjects/POManager";
import UtilsUI from "../../src/utils/utilsUI";
import { TOPOPTIONS } from "../../src/constants/constants";

test.beforeEach(async ({ page }) => {
    const utils = new UtilsUI(page)
    await utils.navigateTo()
})

test('View order', async ({ page }) => {
    const poManager = new POManager(page)
    const utils = new UtilsUI(page)

    const dashboardPage = poManager.getDashboardPage()
    const myCartPage = poManager.getMyCartPage()
    const thankYouPage = poManager.getThankYouPage()
    const yourOrdersPage = poManager.getYourOrdersPage()

    const loginMail = 'starwayheavengod@gmail.com'
    const password = 'Alejandro.123'

    await utils.userLogin({ email: loginMail, password: password })
    const productName = 'ZARA COAT 3'
    await dashboardPage.addProduct({ productName: productName })
    await utils.selectTopMenuOption({ option: TOPOPTIONS.CART })
    await myCartPage.clickCheckout()
    const ccard = '4542 9931 9292 2293'
    await utils.completePayment({ cardNo: ccard, cvv: '123', expireMonth: '06', expireYear: '25', cardName: 'Daniel', country: 'India' })

    let orders = await thankYouPage.getOrdersId()
    await utils.selectTopMenuOption({ option: TOPOPTIONS.ORDERS })
    await page.pause()

    await yourOrdersPage.viewOrder({ orderId: orders })
});

test('Delete order', async ({ page }) => {
    const poManager = new POManager(page)
    const utils = new UtilsUI(page)

    const dashboardPage = poManager.getDashboardPage()
    const myCartPage = poManager.getMyCartPage()
    const thankYouPage = poManager.getThankYouPage()
    const yourOrdersPage = poManager.getYourOrdersPage()

    const loginMail = 'starwayheavengod@gmail.com'
    const password = 'Alejandro.123'

    await utils.userLogin({ email: loginMail, password: password })
    const productName = 'ZARA COAT 3'
    await dashboardPage.addProduct({ productName: productName })
    await utils.selectTopMenuOption({ option: TOPOPTIONS.CART })
    await myCartPage.clickCheckout()
    const ccard = '4542 9931 9292 2293'
    await utils.completePayment({ cardNo: ccard, cvv: '123', expireMonth: '06', expireYear: '25', cardName: 'Daniel', country: 'India' })

    let orders = await thankYouPage.getOrdersId()
    await utils.selectTopMenuOption({ option: TOPOPTIONS.ORDERS })
    await page.pause()
    await yourOrdersPage.deleteOrder({ orderId: orders })
});