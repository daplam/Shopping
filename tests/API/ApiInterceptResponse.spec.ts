import test, { expect, request } from "@playwright/test";
import POManager from "../../src/pageObjects/POManager";
import UtilsUI from "../../src/utils/utilsUI";
import UtilsAPI from "../../src/utils/utilsAPI";
import { TOPOPTIONS } from "../../src/constants/constants";
const loginPayload = { userEmail: "starwayheavengod@gmail.com", userPassword: "Alejandro.123" } // created as javascript object
const createOrderPayload = { orders: [{ country: "Armenia", productOrderedId: "67a8dde5c0d3e6622a297cc8" }] }
// with request object, it allows to call apis

let response: { token: any; orderId: any; }
const fakePayloadResponse = { data: [], message: "No Orders" }


test.beforeAll(async () => { // all inside, will be executed before all tests 1 time

    //LOGIN API
    const apiContext = await request.newContext() // it is similar to start 'browser' for web
    const utilsAPI = new UtilsAPI(apiContext, loginPayload) // create instace from utils class and send the apicontext and loginpayload to the constructor, to have them available in all class
    response = await utilsAPI.createOrder({ createOrderPayload: createOrderPayload }) // assign the return value from the method (method is returning Response object)
})


test('@API Intercept calls - Inject fake Response', async ({ page }) => {
    const poManager = new POManager(page)
    const utils = new UtilsUI(page)

    const yourOrdersPage = poManager.getYourOrdersPage()
    const orderSummaryPage = poManager.getOrderSummaryPage()

    //to insert the token, its needed to execute a JS code, due PW is not able to do it
    //pw is able to execute JS expressions with 'addInitScript' method
    //pass the argument 'value' 
    await page.addInitScript(value => { // addinit has 2 arguments, 1st is the anonymous function
        //insert in the local storage
        window.localStorage.setItem('token', value); // 'token' is the key value in the local storage browser, value is get from 2nd argument token
    }, response.token) // token is the 2nd argument, sent to Setitem to value

    //await page.goto('https://rahulshettyacademy.com/client');
    await utils.navigateTo()


    //1st arg the url to route (network call)
    // 2nd how to route - a function
    //https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/67e4c965c019fb1ad63b022d - it has the user ID at the end
    //in order to use any user, id is replaced with *
    //https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
        async route => { // route can have request, response, headers, cookies, etc, we are sending in the 1st arg only the request url only

            //intercept the response
            // Api will back the response and the response will be send it to browser
            // and with that response, browser will render the data in the frontend
            // Api response (real response from server) -> {playwright injects fake response} - > browser

            //page.request, turning page to api mode
            const response = await page.request.fetch(route.request()) // getting fetch response (the real response)
            //route.fulfill() // fulfill method sends the response to browser

            //JSON.stringify - Converts JS object standard to json object
            let body = JSON.stringify(fakePayloadResponse) // assigning to varible body due fulfill expects body
            // to make the fake response
            route.fulfill({
                body, // sending the body fake response. overrides the body of the real response - It expects a Json object
                response
            })
        }
    )

    await utils.selectTopMenuOption({ option: TOPOPTIONS.ORDERS })
    // to be able to make more actions/assertions is needed to wait for the fake response.
    await page.waitForResponse('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*')
    await yourOrdersPage.viewOrder({ orderId: response.orderId })
});