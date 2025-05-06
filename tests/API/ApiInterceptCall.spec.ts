import test from "@playwright/test";
import POManager from "../../src/pageObjects/POManager";
import UtilsUI from "../../src/utils/utilsUI";
import { TOPOPTIONS } from "../../src/constants/constants";


test('@API View order', async ({ page }) => {
    const poManager = new POManager(page)
    const utils = new UtilsUI(page)
    const yourOders = poManager.getYourOrdersPage()
    const orderSummary = poManager.getThankYouPage()

    const loginMail = 'starwayheavengod@gmail.com'
    const password = 'Alejandro.123'
    await utils.navigateTo()
    await utils.userLogin({ email: loginMail, password: password })

    await utils.selectTopMenuOption({ option: TOPOPTIONS.ORDERS })

    //encounter get call
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*', // use * to use any id received
        async route => { // route can have request, response, headers, cookies, etc, we are sending in the 1st arg only the request url only


            // to make the fake call. It will continue with the url passed in continue() method.
            route.continue({ // continue method, will continue with the data of what you want to modify. body, url, headers, etc
                url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'
            })
        }
    )

    await yourOders.viewOrder()
    await orderSummary.notAuthorized()

});