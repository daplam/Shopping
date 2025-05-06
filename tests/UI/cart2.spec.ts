import cartData from '../../testData/cartData.json'
import { DataCard } from "../../src/types";
import POManager from '../../src/pageObjects/POManager';
import UtilsUI from '../../src/utils/utilsUI';
import { TOPOPTIONS } from '../../src/constants/constants';
import test, { BrowserContext, Page } from '@playwright/test';
const dataset: DataCard[] = cartData;

for (const data of dataset) {
    test.describe(`Escenario para producto: ${data.product}`, () => {
        let context: BrowserContext
        let page: Page
        let poManager: POManager
        let utils: UtilsUI

        test.beforeEach(async ({ browser }) => {
            context = await browser.newContext(); // nuevo contexto para evitar mezcla
            page = await context.newPage();
            poManager = new POManager(page);
            utils = new UtilsUI(page);
            await utils.navigateTo()
        });

        test(`TC01 - Complete order - 1 Product of ${data.product}`, async () => {

            // const poManager = new POManager(page)
            const utils = new UtilsUI(page)

            const dashboardPage = poManager.getDashboardPage()
            const myCartPage = poManager.getMyCartPage()
            const thankYouPage = poManager.getThankYouPage()
            const yourOrdersPage = poManager.getYourOrdersPage()

            await utils.userLogin({ email: data.username, password: data.password })
            const productName = 'ZARA COAT 3'
            await dashboardPage.addProduct({ productName: data.product })
            await utils.selectTopMenuOption({ option: TOPOPTIONS.CART })
            await myCartPage.clickCheckout()
            const ccard = '4542 9931 9292 2293'
            await utils.completePayment({ cardNo: ccard, cvv: '123', expireMonth: '06', expireYear: '25', cardName: 'Daniel', country: 'India' })

            let orders = await thankYouPage.getOrdersId()
            await utils.selectTopMenuOption({ option: TOPOPTIONS.ORDERS })
            await yourOrdersPage.verifyOrder({ orderId: orders })
            await utils.selectTopMenuOption({ option: TOPOPTIONS.HOME })
            await utils.userLogOut()

        })

        test.afterEach(async () => {
            await context.close();
        });
    });
}